import { NextRequest } from "next/server";
import { getSarvamChatCompletion } from "@/actions/sarvam-chat";

function getChatStatusCode(error?: string): number {
  if (!error) return 500;
  if (error.includes("missing")) return 500;
  if (error.includes("authentication failed")) return 401;
  return 500;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body || !body.messages || !body.language) {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid request payload" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = await getSarvamChatCompletion({
      messages: body.messages,
      language: body.language,
      context: body.context,
    });

    return new Response(JSON.stringify(result), {
      status: result.success ? 200 : getChatStatusCode(result.error),
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Chat route error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error instanceof Error ? error.message : "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
