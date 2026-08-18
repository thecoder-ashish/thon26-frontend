import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';

const ImageScroller = ({ imageLinks }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  const filteredImageLinks = imageLinks.filter(Boolean);

  useEffect(() => {
    if (filteredImageLinks.length <= 1) return; // Don't set interval if there's only one image

    const interval = setInterval(() => {
      setTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % filteredImageLinks.length);
        setTransitioning(false);
      }, 100); // duration of the transition
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [filteredImageLinks]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (filteredImageLinks.length <= 1) return;

      setTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % filteredImageLinks.length);
        setTransitioning(false);
      }, 300);
    },
    onSwipedRight: () => {
      if (filteredImageLinks.length <= 1) return;

      setTransitioning(true);
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + filteredImageLinks.length) % filteredImageLinks.length);
        setTransitioning(false);
      }, 300);
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: true
  });

  return (
    <div className="relative w-full aspect-square flex items-center justify-center overflow-hidden rounded-2xl bg-black/5 dark:bg-white/5">
      <img
        src={filteredImageLinks[currentImageIndex]}
        alt="Event Banner"
        className={`w-full h-full aspect-square object-cover rounded-2xl ${transitioning ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...handlers}
      />
      {filteredImageLinks.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10 bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
          {filteredImageLinks.map((_, index) => (
            <span
              key={index}
              className={`h-2 w-2 rounded-full cursor-pointer transition-colors ${index === currentImageIndex ? 'bg-white' : 'bg-white/40'}`}
              onClick={() => setCurrentImageIndex(index)}
            ></span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageScroller;
