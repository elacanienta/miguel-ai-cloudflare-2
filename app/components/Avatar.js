'use client';

import { useState, useRef, useEffect } from 'react';

export default function Avatar({ isSpeaking, videoToPlay, onVideoEnd, isAltAvatar, onAvatarSwitch }) {
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

  // Get video paths based on avatar type
  const getVideoPath = (videoName) => {
    const suffix = isAltAvatar ? 'ALT' : '';
    return `/${videoName}${suffix}.mp4`;
  };

  // Get poster image path based on avatar type
  const getPosterPath = () => {
    const suffix = isAltAvatar ? '-alt' : '';
    return `/idle-poster${suffix}.jpg`;
  };

  useEffect(() => {
    if (idleVideoRef.current) {
      // Set initial source and check if video is already loaded
      idleVideoRef.current.src = getVideoPath('Idle');
      if (idleVideoRef.current.readyState >= 3) {
        setIsIdleLoading(false);
      }
      idleVideoRef.current.play();
    }
  }, []);

  // Effect to handle avatar switching for idle video
  useEffect(() => {
    if (isIdle && idleVideoRef.current) {
      // Update the video source when avatar changes
      const newSrc = getVideoPath('Idle');
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
      const newSrc = getVideoPath('Intro_Static');
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
        src={getPosterPath()}
        alt="Avatar"
        className="absolute inset-0 w-full h-full object-contain"
      />

      {/* Red Play Button - Bottom Center */}
      {isIdle && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex items-center gap-3">
          <button
            onClick={playIntro}
            className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-700 shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            aria-label="Play intro"
          >
            <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
            </svg>
          </button>
          
          <button
            onClick={onAvatarSwitch}
            className={`w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-110 ${
              isAltAvatar 
                ? 'bg-blue-600 hover:bg-blue-700' 
                : 'bg-gray-600 hover:bg-gray-700'
            }`}
            aria-label={`Switch to ${isAltAvatar ? 'default' : 'alternate'} avatar`}
            title={`Currently: ${isAltAvatar ? 'Alternate' : 'Default'} Avatar`}
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
            </svg>
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
        preload="auto"
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
        preload="auto"
        playsInline
        onCanPlay={() => setIsIdleLoading(false)}
        onLoadedData={() => setIsIdleLoading(false)}
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

