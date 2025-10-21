// import React, { useRef, useState } from 'react';
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/effect-cards';
// import './style.css';
// import { EffectCards } from 'swiper/modules';


// export const SwipperCards = () => {


//     return(
//        <Swiper
//         effect={'cards'}
//         grabCursor={true}
//         modules={[EffectCards]}
//         className="mySwiper py-10"
//       >
//         <SwiperSlide 
//         >Slide 1</SwiperSlide>
//         <SwiperSlide>Slide 2</SwiperSlide>
//       </Swiper>
//     )
// }
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-cards';
import './style.css';
import { EffectCards } from 'swiper/modules';
import Image from 'next/image';

export const SwipperCards = () => {
  const slides = [
    { id: 1, bg: '/landing/background1.jpg',col1text:"Adventure Ready", col2text:"Stay warm anywhere",icons:'/landing/hotcarbon.svg' },
    { id: 2, bg: '/landing/background2.png',col1text:"Compact & Portable", col2text:"Heat on the go",icons:'/landing/hotcarbon.svg' },
  ];

  return (
    <Swiper
      effect={'cards'}
      grabCursor={true}
      modules={[EffectCards]}
      className="mySwiper py-10"
    >
      {slides.map((slide) => (
        <SwiperSlide
          key={slide.id}
          className="relative bg-cover bg-center rounded-2xl overflow-hidden border-2 border-primary"
          style={{
            backgroundImage: `url(${slide.bg})`,
          }}
        >
          {/* Overlay card */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#191818] border-2 border-primary rounded-xl px-6 py-4 flex justify-between items-center w-[85%] max-w-md backdrop-blur-md shadow-md">
            {/* Left side */}
            <div className="flex flex-col">
              <span className="text-lg font-semibold text-white">{slide.col1text}</span>
              <span className="text-sm opacity-80">{slide.col2text}</span>
            </div>

            {/* Right side (icon) */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 border-primary bg-primary/30">
             <Image 
             src={slide.icons}
             height={40}
             width={40}
             alt='icons'
             className='w-7 h-7'/>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
