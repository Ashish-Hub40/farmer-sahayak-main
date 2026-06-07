import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Enhanced speech recognition hook with proper error handling.
 * Works reliably across browsers with fallback options.
 */
export function useSpeechRecognition() {
  const [transcript, setTranscript] = useState("");
  const [listening, setListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);
  const initializedRef = useRef(false);
  const isCleaningUpRef = useRef(false);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const finalTranscriptRef = useRef("");
  const lastResultIndexRef = useRef(0);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasReceivedAudioRef = useRef(false);

  // Initialize Speech Recognition once
  const initializeSpeechRecognition = useCallback(() => {
    if (initializedRef.current && recognitionRef.current) {
      return true; // Already initialized
    }

    try {
      // Get Speech Recognition API
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (!SpeechRecognition) {
        setIsSupported(false);
        setError("Speech Recognition not supported in this browser");
        console.warn("Speech Recognition API not available");
        return false;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-IN";

      recognition.onstart = () => {
        setListening(true);
        setError(null);
        hasReceivedAudioRef.current = false;
        console.log("Speech recognition started - listening for audio...");
        
        // Set a timeout to stop listening if no audio is detected
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        silenceTimeoutRef.current = setTimeout(() => {
          if (!hasReceivedAudioRef.current && recognitionRef.current && listening) {
            console.warn("No audio detected after 10 seconds - stopping recognition");
            try {
              recognitionRef.current.abort();
            } catch (e) {
              // Ignore
            }
            recognitionRef.current = null;
            initializedRef.current = false;
            setListening(false);
            setError("No audio detected. Please check your microphone and try again.");
          }
        }, 10000);
      };

      recognition.onresult = (event: any) => {
        // Mark that we've received audio
        hasReceivedAudioRef.current = true;
        
        // Clear the silence timeout since we got audio
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
        
        let interimTranscript = "";

        // Process results starting from the last index we saw
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            // Add final result to our final transcript store
            finalTranscriptRef.current += transcript + " ";
          } else {
            // Accumulate interim results (these will be replaced by next interim or become final)
            interimTranscript += transcript;
          }
        }
        // Update the displayed transcript with final results + current interim
        const displayTranscript = finalTranscriptRef.current + interimTranscript;
        setTranscript(displayTranscript);
        lastResultIndexRef.current = event.results.length;
      };

      recognition.onerror = (event: any) => {
        // Clear silence timeout on error
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }

        // Ignore "aborted" error during cleanup
        if (event.error === "aborted") {
          if (!isCleaningUpRef.current) {
            console.log("Speech recognition aborted by user");
          }
          return;
        }

        // Ignore "network" errors for better UX (common with Web Speech API)
        if (event.error === "network") {
          console.warn("Network error in speech recognition - this is common and can be ignored");
          return;
        }

        if (event.error === "no-speech") {
          setError("No speech detected. Please try again.");
          console.warn("No speech detected - user may need to speak louder or check microphone");
          if (recognitionRef.current) {
            try {
              recognitionRef.current.abort();
            } catch (e) {
              // Ignore abort failures
            }
          }
          recognitionRef.current = null;
          initializedRef.current = false;
          setListening(false);
          return;
        }

        const errorMessage = `Speech Recognition Error: ${event.error}`;
        setError(errorMessage);
        console.error("Speech recognition error:", event.error);
      };

      recognition.onend = () => {
        // Clear silence timeout when recognition ends
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
        setListening(false);
        console.log("Speech recognition ended");
      };

      recognitionRef.current = recognition;
      initializedRef.current = true;
      return true;
    } catch (err: any) {
      const errorMsg = `Initialization error: ${err.message}`;
      setError(errorMsg);
      console.error("Speech recognition initialization error:", err);
      return false;
    }
  }, []);

  // Request microphone permission
  const requestMicrophonePermission = useCallback(async (): Promise<boolean> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      // Stop the stream - we only needed permission
      stream.getTracks().forEach((track) => track.stop());
      return true;
    } catch (err: any) {
      const errorMsg =
        err.name === "NotAllowedError"
          ? "Microphone permission denied. Please enable microphone access in browser settings."
          : err.name === "NotFoundError"
          ? "No microphone found. Please connect a microphone."
          : `Microphone error: ${err.message}`;

      setError(errorMsg);
      console.error("Microphone permission error:", err);
      return false;
    }
  }, []);

  const resetRecognition = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // Ignore abort errors during cleanup
      }
    }
    recognitionRef.current = null;
    initializedRef.current = false;
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isCleaningUpRef.current = true;
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
      }
      resetRecognition();
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [resetRecognition]);

  const startListening = useCallback(async (lang: string = "en-IN") => {
    if (listening) {
      console.log("Already listening");
      return;
    }

    // Clear any previous timeout
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }

    // Request microphone permission first
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      return;
    }

    // Reset recognition state for a fresh start
    resetRecognition();
    
    // Initialize speech recognition
    const initialized = initializeSpeechRecognition();
    if (!initialized || !recognitionRef.current) {
      setError("Speech Recognition not available");
      return;
    }

    try {
      recognitionRef.current.lang = lang;
      setTranscript("");
      finalTranscriptRef.current = "";
      lastResultIndexRef.current = 0;
      setError(null);
      hasReceivedAudioRef.current = false;
      recognitionRef.current.start();
      console.log("Recognition started, listening for speech...");
    } catch (err: any) {
      console.error("Error starting recognition:", err);
      setError(err.message);
    }
  }, [listening, requestMicrophonePermission, initializeSpeechRecognition, resetRecognition]);

  const stopListening = useCallback(() => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (recognitionRef.current && listening) {
      try {
        recognitionRef.current.stop();
      } catch (err: any) {
        console.error("Error stopping recognition:", err);
      }
    }
  }, [listening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    finalTranscriptRef.current = "";
    lastResultIndexRef.current = 0;
    setError(null);
  }, []);

  return {
    transcript,
    listening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  };
}