// Fullscreen utility functions
export const toggleFullscreen = (element = document.documentElement) => {
  if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
    // Enter fullscreen
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
};

export const isFullscreen = () => {
  return !!(document.fullscreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
};

export const onFullscreenChange = (callback) => {
  const events = ['fullscreenchange', 'webkitfullscreenchange', 'msfullscreenchange'];
  
  events.forEach(event => {
    document.addEventListener(event, callback);
  });

  // Return cleanup function
  return () => {
    events.forEach(event => {
      document.removeEventListener(event, callback);
    });
  };
};

// Mobile-specific fixes
export const fixMobileViewport = () => {
  // Prevent zoom on double tap
  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  // Handle viewport height changes (mobile address bar)
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  setVH();
  window.addEventListener('resize', setVH);
  window.addEventListener('orientationchange', setVH);

  return () => {
    window.removeEventListener('resize', setVH);
    window.removeEventListener('orientationchange', setVH);
  };
};