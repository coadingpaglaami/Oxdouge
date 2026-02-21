"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectCards } from 'swiper/modules';

export interface HeroImage {
  id: number;
  image: string;
  heading: string;
  sub_heading: string;
}

export interface HeroPromotionResponse {
  title1: string;
  title2: string;
  description: string;
  existing_images: HeroImage[];
}

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-cards';

interface SwipperCardsProps {
  images: HeroImage[];
}

export const SwipperCards = ({ images }: SwipperCardsProps) => {
  // If no images from API, use fallback data
  const slides = images.length > 0 ? images : [
    { 
      id: 1, 
      image: '/landing/background1.jpg', 
      heading: "Adventure Ready", 
      sub_heading: "Stay warm anywhere" 
    },
    { 
      id: 2, 
      image: '/landing/background2.png', 
      heading: "Compact & Portable", 
      sub_heading: "Heat on the go" 
    },
  ];

  return (
    <Swiper
      effect={'cards'}
      grabCursor={true}
      modules={[EffectCards]}
      className="mySwiper py-10 w-full max-w-md mx-auto"
      cardsEffect={{
        perSlideOffset: 8,
        perSlideRotate: 2,
        rotate: true,
        slideShadows: true,
      }}
    >
      {slides.map((slide) => (
        <SwiperSlide
          key={slide.id}
          className="relative bg-cover bg-center rounded-2xl overflow-hidden border-2 border-primary aspect-[3/4]"
          style={{
            backgroundImage: `url(${slide.image})`,
          }}
        >
          {/* Overlay card */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#191818] border-2 border-primary rounded-xl px-6 py-4 flex justify-between items-center w-[85%] max-w-md backdrop-blur-md shadow-md">
            {/* Left side */}
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-white">
                {slide.heading}
              </span>
              <span className="text-sm opacity-80 text-white">
                {slide.sub_heading}
              </span>
            </div>

            {/* Right side (icon) */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary bg-primary/30">
              <Image 
                src="/landing/hotcarbon.svg"
                height={40}
                width={40}
                alt='icons'
                className='w-7 h-7'
              />
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};