"use client";

import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import WeatherCard from "./cards/WeatherCard";
import { 
  Mic, 
  MessageCircle, 
  Camera, 
  BookOpen, 
  Stethoscope, 
  Calendar, 
  BarChart3, 
  Building2 
} from "lucide-react";
import ProfileHeader from "./ProfileHeader";
import AudioButton from "./ui/AudioButton";

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const currentLanguage = useStore((state) => state.currentLanguage);
  const router = useRouter();

  useEffect(() => {
    if (currentLanguage) {
      i18n.changeLanguage(currentLanguage);
    }
  }, [currentLanguage, i18n]);

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-green-100">
      <ProfileHeader />
      
      {/* Main Grid */}
      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6 max-w-6xl pb-24 md:pb-32">
        {/* Weather Card - Full Width Rectangle */}
        <div className="mb-4 md:mb-6">
          <WeatherCard />
        </div>

        {/* Action Cards - 4 Square Tiles in 2x2 Grid */}
        <div className="grid grid-cols-2 gap-4 md:gap-6">
          
          {/* Voice Input Card */}
          <div
            onClick={() => navigateTo("/voice")}
            className="group bg-linear-to-br from-purple-300/40 via-fuchsia-200/40 to-indigo-200/40 backdrop-blur-2xl rounded-3xl md:rounded-4xl shadow-lg hover:shadow-2xl border border-white/40 p-6 md:p-8 h-48 md:h-64 transition-all duration-300 text-gray-800 relative overflow-hidden cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigateTo("/voice")}
          >
            <div className="absolute top-3 right-3 z-20">
              <AudioButton text={`${t('speak')}. ${t('askByVoice')}`} className="bg-white/40 hover:bg-white/60 text-gray-800" />
            </div>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white/40 backdrop-blur-xl rounded-full flex items-center justify-center mb-3 md:mb-4 transition-transform border border-white/60">
                <Mic className="w-8 h-8 md:w-12 md:h-12 text-purple-700" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">{t('speak')}</h3>
              <p className="text-xs md:text-sm text-gray-800 text-center px-2">{t('askByVoice')}</p>
            </div>
          </div>

          {/* Chat Card */}
          <div
            onClick={() => navigateTo("/chat")}
            className="group bg-linear-to-br from-emerald-300/40 via-lime-200/40 to-emerald-100/40 backdrop-blur-2xl rounded-3xl md:rounded-4xl shadow-lg hover:shadow-2xl border border-white/40 p-6 md:p-8 h-48 md:h-64 transition-all duration-300 text-gray-800 relative overflow-hidden cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigateTo("/chat")}
          >
            <div className="absolute top-3 right-3 z-20">
              <AudioButton text={`${t('chat')}. ${t('typeToAsk')}`} className="bg-white/40 hover:bg-white/60 text-gray-800" />
            </div>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white/40 backdrop-blur-xl rounded-full flex items-center justify-center mb-3 md:mb-4 transition-transform border border-white/60">
                <MessageCircle className="w-8 h-8 md:w-12 md:h-12 text-green-700" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">{t('chat')}</h3>
              <p className="text-xs md:text-sm text-gray-800 text-center px-2">{t('typeToAsk')}</p>
            </div>
          </div>

          {/* Image Upload Card */}
          <div
            onClick={() => navigateTo("/image")}
            className="group bg-linear-to-br from-orange-300/40 via-amber-300/40 to-amber-200/40 backdrop-blur-2xl rounded-3xl md:rounded-4xl shadow-lg hover:shadow-2xl border border-white/40 p-6 md:p-8 h-48 md:h-64 transition-all duration-300 text-gray-800 relative overflow-hidden cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigateTo("/image")}
          >
            <div className="absolute top-3 right-3 z-20">
              <AudioButton text={`${t('uploadPhoto')}. ${t('checkCropDisease')}`} className="bg-white/40 hover:bg-white/60 text-gray-800" />
            </div>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white/40 backdrop-blur-xl rounded-full flex items-center justify-center mb-3 md:mb-4 transition-transform border border-white/60">
                <Camera className="w-8 h-8 md:w-12 md:h-12 text-orange-700" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">{t('uploadPhoto')}</h3>
              <p className="text-xs md:text-sm text-gray-800 text-center px-2">{t('checkCropDisease')}</p>
            </div>
          </div>

          {/* Learn Card */}
          <div
            onClick={() => navigateTo("/learn")}
            className="group bg-linear-to-br from-amber-200/40 via-orange-300/40 to-orange-100/40 backdrop-blur-2xl rounded-3xl md:rounded-4xl shadow-lg hover:shadow-2xl border border-white/40 p-6 md:p-8 h-48 md:h-64 transition-all duration-300 text-gray-800 relative overflow-hidden cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigateTo("/learn")}
          >
            <div className="absolute top-3 right-3 z-20">
              <AudioButton text={`${t('learn')}. ${t('listenAndLearn')}`} className="bg-white/40 hover:bg-white/60 text-gray-800" />
            </div>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white/40 backdrop-blur-xl rounded-full flex items-center justify-center mb-3 md:mb-4 transition-transform border border-white/60">
                <BookOpen className="w-8 h-8 md:w-12 md:h-12 text-orange-700" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">{t('learn')}</h3>
              <p className="text-xs md:text-sm text-gray-800 text-center px-2">{t('listenAndLearn')}</p>
            </div>
          </div>

          {/* Crop Doctor Card - NEW */}
          <div
            onClick={() => navigateTo("/crop-doctor")}
            className="group bg-linear-to-br from-teal-300/40 via-emerald-200/40 to-cyan-200/40 backdrop-blur-2xl rounded-3xl md:rounded-4xl shadow-lg hover:shadow-2xl border border-white/40 p-6 md:p-8 h-48 md:h-64 transition-all duration-300 text-gray-800 relative overflow-hidden cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigateTo("/crop-doctor")}
          >
            <div className="absolute top-3 right-3 z-20">
              <AudioButton text={`${t('cropDoctor')}. ${t('cropDoctorDesc')}`} className="bg-white/40 hover:bg-white/60 text-gray-800" />
            </div>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white/40 backdrop-blur-xl rounded-full flex items-center justify-center mb-3 md:mb-4 transition-transform border border-white/60">
                <Stethoscope className="w-8 h-8 md:w-12 md:h-12 text-teal-700" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">{t('cropDoctor')}</h3>
              <p className="text-xs md:text-sm text-gray-800 text-center px-2">{t('cropDoctorDesc')}</p>
            </div>
          </div>

          {/* Almanac Card - NEW */}
          <div
            onClick={() => navigateTo("/almanac")}
            className="group bg-linear-to-br from-indigo-300/40 via-indigo-200/40 to-blue-200/40 backdrop-blur-2xl rounded-3xl md:rounded-4xl shadow-lg hover:shadow-2xl border border-white/40 p-6 md:p-8 h-48 md:h-64 transition-all duration-300 text-gray-800 relative overflow-hidden cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigateTo("/almanac")}
          >
            <div className="absolute top-3 right-3 z-20">
              <AudioButton text={`${t('almanac')}. ${t('almanacDesc')}`} className="bg-white/40 hover:bg-white/60 text-gray-800" />
            </div>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white/40 backdrop-blur-xl rounded-full flex items-center justify-center mb-3 md:mb-4 transition-transform border border-white/60">
                <Calendar className="w-8 h-8 md:w-12 md:h-12 text-indigo-700" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">{t('almanac')}</h3>
              <p className="text-xs md:text-sm text-gray-800 text-center px-2">{t('almanacDesc')}</p>
            </div>
          </div>

          {/* Farm Insights Card - NEW */}
          <div
            onClick={() => navigateTo("/insights")}
            className="group bg-linear-to-br from-rose-300/40 via-pink-200/40 to-rose-100/40 backdrop-blur-2xl rounded-3xl md:rounded-4xl shadow-lg hover:shadow-2xl border border-white/40 p-6 md:p-8 h-48 md:h-64 transition-all duration-300 text-gray-800 relative overflow-hidden cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigateTo("/insights")}
          >
            <div className="absolute top-3 right-3 z-20">
              <AudioButton text={`${t('farmInsights')}. ${t('farmInsightsDesc')}`} className="bg-white/40 hover:bg-white/60 text-gray-800" />
            </div>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white/40 backdrop-blur-xl rounded-full flex items-center justify-center mb-3 md:mb-4 transition-transform border border-white/60">
                <BarChart3 className="w-8 h-8 md:w-12 md:h-12 text-rose-700" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">{t('farmInsights')}</h3>
              <p className="text-xs md:text-sm text-gray-800 text-center px-2">{t('farmInsightsDesc')}</p>
            </div>
          </div>

          {/* Government Schemes Card - NEW */}
          <div
            onClick={() => navigateTo("/schemes")}
            className="group bg-linear-to-br from-amber-300/40 via-yellow-200/40 to-amber-200/40 backdrop-blur-2xl rounded-3xl md:rounded-4xl shadow-lg hover:shadow-2xl border border-white/40 p-6 md:p-8 h-48 md:h-64 transition-all duration-300 text-gray-800 relative overflow-hidden cursor-pointer"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigateTo("/schemes")}
          >
            <div className="absolute top-3 right-3 z-20">
              <AudioButton text={`${t('govSchemes')}. ${t('govSchemesDesc')}`} className="bg-white/40 hover:bg-white/60 text-gray-800" />
            </div>
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-white/40 backdrop-blur-xl rounded-full flex items-center justify-center mb-3 md:mb-4 transition-transform border border-white/60">
                <Building2 className="w-8 h-8 md:w-12 md:h-12 text-amber-700" />
              </div>
              <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-900">{t('govSchemes')}</h3>
              <p className="text-xs md:text-sm text-gray-800 text-center px-2">{t('govSchemesDesc')}</p>
            </div>
          </div>
        </div>
        
        {/* Website Info Section - Static */}
        <div className="mt-8 mb-4">
          <div className="bg-linear-to-br from-emerald-200/35 to-emerald-100/35 backdrop-blur-2xl rounded-3xl shadow-lg border border-white/40 p-5 md:p-6">
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className="shrink-0">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/40 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/60">
                  <span className="text-2xl md:text-3xl">🌾</span>
                </div>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/60">
                    <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                    <h3 className="text-base md:text-lg font-bold text-gray-900">{t('appName')}</h3>
                  </div>
                  <AudioButton text={`${t('appName')}. ${t('websiteInfo')}`} />
                </div>
                <p className="text-xs md:text-sm text-gray-800 leading-relaxed">{t('websiteInfo')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Grass Animation at Bottom */}
      <div className="fixed bottom-0 left-0 right-0 w-full h-20 md:h-28 pointer-events-none z-40">
        <Image
          src="/grass.gif"
          alt="Grass"
          width={1920}
          height={112}
          className="w-full h-full object-cover object-bottom"
          priority
        />
      </div>
    </div>
  );
}
