'use client';

import { useState, useRef, useEffect } from 'react';
import { getVideoPath, getPosterPath, getFaceIconPath, VIDEO_NAMES } from '@/lib/assets';

export default function Avatar({ isSpeaking, videoToPlay, onVideoEnd, isAltAvatar, onAvatarSwitch, language, onLanguageToggle }) {
  const videoRef = useRef(null);
  const idleVideoRef = useRef(null);
  const introVideoRef = useRef(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [introPlayed, setIntroPlayed] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [isIdleLoading, setIsIdleLoading] = useState(true);
  const [isIntroLoading, setIsIntroLoading] = useState(false);
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);

  useEffect(() => {
    if (idleVideoRef.current) {
      // Set initial source and check if video is already loaded
      idleVideoRef.current.src = getVideoPath(VIDEO_NAMES.idle, { isReal: isAltAvatar, language });
      idleVideoRef.current.load(); // Explicitly load the video
      if (idleVideoRef.current.readyState >= 3) {
        setIsIdleLoading(false);
      }
      idleVideoRef.current.play().catch(err => console.log('Initial idle play error:', err));
    }
  }, []);

  // Effect to handle avatar switching for idle video
  useEffect(() => {
    if (isIdle && idleVideoRef.current) {
      // Update the video source when avatar changes
      const newSrc = getVideoPath(VIDEO_NAMES.idle, { isReal: isAltAvatar, language });
      if (idleVideoRef.current.src !== window.location.origin + newSrc) {
        idleVideoRef.current.src = newSrc;
        idleVideoRef.current.load();
        idleVideoRef.current.play().catch(err => console.log('Idle play error:', err));
      }
    }
  }, [isAltAvatar, isIdle]);

  const handleIntroEnd = () => {
    setShowIntro(false);
    setIntroPlayed(true);
    setIsIdle(true);
    if (idleVideoRef.current) {
      idleVideoRef.current.play().catch(err => console.log('Idle play error:', err));
    }
  };

  const playIntro = () => {
    setIsIntroLoading(true);
    if (introVideoRef.current) {
      // Update intro video source based on current avatar
      const newSrc = getVideoPath(VIDEO_NAMES.introStatic, { isReal: isAltAvatar, language });
      introVideoRef.current.src = newSrc;
      introVideoRef.current.currentTime = 0;
      introVideoRef.current.load();
      introVideoRef.current.play();
    }
  };

  useEffect(() => {
    if (videoToPlay && videoRef.current) {
      setIsContentLoading(true);
      setIsContentReady(false);
      videoRef.current.src = videoToPlay;
      videoRef.current.currentTime = 0;
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [videoToPlay]);

  const handleContentReady = () => {
    setIsContentLoading(false);
    setIsContentReady(true);
    setIsPlayingVideo(true);
    setIsIdle(false);
    setShowIntro(false);
    if (idleVideoRef.current) {
      idleVideoRef.current.pause();
    }
    if (introVideoRef.current) {
      introVideoRef.current.pause();
    }
  };

  const handleIntroReady = () => {
    setIsIntroLoading(false);
    setShowIntro(true);
    setIsIdle(false);
    if (idleVideoRef.current) {
      idleVideoRef.current.pause();
    }
  };

  const handleVideoEnd = () => {
    setIsPlayingVideo(false);
    setIsContentReady(false);
    setIsIdle(true);
    if (idleVideoRef.current) {
      idleVideoRef.current.play();
    }
    if (onVideoEnd) {
      onVideoEnd();
    }
  };

  return (
    <div className="w-full h-full relative flex items-center justify-center overflow-hidden">

      {/* Static Poster Image - Always visible as background */}
      <img
        src={getPosterPath(isAltAvatar)}
        alt="Avatar"
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* Control Buttons - Bottom Center */}
      {isIdle && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-3">
          {/* Language Toggle Button */}
          <button
            onClick={onLanguageToggle}
            className="group w-10 h-10 rounded-full shadow-lg overflow-hidden border border-white/50 transition-all duration-300 hover:scale-110 hover:bg-white/60 backdrop-blur-md bg-white/50"
            aria-label={`Switch to ${language === 'english' ? 'German' : 'English'}`}
            title={`Current language: ${language === 'english' ? 'English' : 'German'}`}
          >
            {language === 'english' ? (
              // UK Flag
              <svg viewBox="0 0 60 60" className="w-full h-full opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                <defs>
                  <clipPath id="uk-flag">
                    <circle cx="30" cy="30" r="30"/>
                  </clipPath>
                </defs>
                <g clipPath="url(#uk-flag)">
                  <rect width="60" height="60" fill="#012169"/>
                  <path d="M0,0 L60,60 M60,0 L0,60" stroke="#fff" strokeWidth="10"/>
                  <path d="M0,0 L60,60 M60,0 L0,60" stroke="#C8102E" strokeWidth="6"/>
                  <path d="M30,0 v60 M0,30 h60" stroke="#fff" strokeWidth="16"/>
                  <path d="M30,0 v60 M0,30 h60" stroke="#C8102E" strokeWidth="10"/>
                </g>
              </svg>
            ) : (
              // German Flag
              <div className="w-full h-full flex flex-col opacity-50 group-hover:opacity-100 transition-opacity duration-300">
                <div className="h-1/3 bg-black"></div>
                <div className="h-1/3 bg-[#DD0000]"></div>
                <div className="h-1/3 bg-[#FFCE00]"></div>
              </div>
            )}
          </button>

          {/* Play Intro Button */}
          <button
            onClick={playIntro}
            className="w-12 h-12 rounded-full bg-red-600/50 hover:bg-red-600/70 backdrop-blur-md shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 border border-red-400/50"
            aria-label="Play intro"
          >
            <svg className="w-6 h-6 text-white ml-0.5 drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
            </svg>
          </button>

          {/* Avatar Switch Button */}
          <button
            onClick={onAvatarSwitch}
            className="group w-10 h-10 rounded-full shadow-lg overflow-hidden border border-white/50 transition-all duration-300 hover:scale-110 hover:border-white/60 relative backdrop-blur-md bg-white/50"
            aria-label={`Switch to ${isAltAvatar ? 'default' : 'alternate'} avatar`}
            title={`Switch to ${isAltAvatar ? 'default' : 'alternate'} avatar`}
          >
            <img
              src={getFaceIconPath(!isAltAvatar)}
              alt={`${isAltAvatar ? 'Default' : 'Alternate'} avatar`}
              className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity duration-300"
            />
          </button>
        </div>
      )}

      {/* Intro Video */}
      <video
        ref={introVideoRef}
        className="absolute inset-0 w-full h-full object-contain"
        onEnded={handleIntroEnd}
        onCanPlay={handleIntroReady}
        onLoadedData={handleIntroReady}
        preload="metadata"
        playsInline
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        style={{ pointerEvents: 'none', display: showIntro ? 'block' : 'none' }}
      />

      {/* Idle Loop Video */}
      <video
        ref={idleVideoRef}
        className="absolute inset-0 w-full h-full object-contain"
        loop
        muted
        preload="metadata"
        playsInline
        onCanPlay={() => setIsIdleLoading(false)}
        onLoadedData={() => setIsIdleLoading(false)}
        onLoadStart={() => setIsIdleLoading(true)}
        onError={(e) => {
          console.error('Idle video error:', e);
          setIsIdleLoading(false);
        }}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
        style={{ pointerEvents: 'none', display: !showIntro && !isPlayingVideo ? 'block' : 'none' }}
      />

      {/* Content Video Overlay */}
      {videoToPlay && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-contain"
          onEnded={handleVideoEnd}
          onCanPlay={handleContentReady}
          onLoadedData={handleContentReady}
          preload="auto"
          playsInline
          disablePictureInPicture
          controlsList="nodownload nofullscreen noremoteplayback"
          style={{ pointerEvents: 'none', display: isContentReady ? 'block' : 'none' }}
        />
      )}

      {/* Loading Indicator - Show on initial load and video transitions */}
      {(isIdleLoading || (isContentLoading && !isContentReady) || (isIntroLoading && !showIntro)) && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="flex gap-1">
              <div className="w-3 h-3 rounded-full bg-white shadow-lg animate-bounce"></div>
              <div className="w-3 h-3 rounded-full bg-white shadow-lg animate-bounce" style={{animationDelay: '0.1s'}}></div>
              <div className="w-3 h-3 rounded-full bg-white shadow-lg animate-bounce" style={{animationDelay: '0.2s'}}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

