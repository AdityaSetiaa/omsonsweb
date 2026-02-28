import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from 'react';

export const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const images = [
    "https://omsonslabs.com/wp-content/uploads/hydrometer-thermometer-banner.webp",
    "https://omsonslabs.com/wp-content/uploads/plasticware-banner.webp",
    "https://omsonslabs.com/wp-content/uploads/laboratory-instrument.webp",
    
  ];

  const prevImage = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, 3000);

    return () => clearInterval(interval);
  }, [nextImage]);

  return (
    <div className="relative w-full overflow-hidden z-10">
      <div
        className="flex transition-transform duration-600 h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, i) => (
          <img
          key={src.length}
            src={src}
            className="w-full h-1/2 shrink-0 object-cover"
            alt={`slide ${i + 1}`}
          />
        ))}
      </div>

    

      <button
        onClick={prevImage}
        className="absolute top-1/2 left-3 -translate-y-1/2 z-30 p-2 rounded-full hover:bg-black/20 transition-colors"
        aria-label="Previous image"
      >
        <IoIosArrowBack className="h-10 w-10 text-white/80 hover:text-white" />
      </button>

      <button
        onClick={nextImage}
        className="absolute top-1/2 right-3 -translate-y-1/2 z-30 p-2 rounded-full hover:bg-black/20 transition-colors"
        aria-label="Next image"
      >
        <IoIosArrowForward className="h-10 w-10 text-white/80 hover:text-white" />
      </button>
    </div>
  );
};