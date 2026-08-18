// userAgent.js

export const isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  };
  
  export const isAndroid = () => {
    return /Android/.test(navigator.userAgent);
  };
  