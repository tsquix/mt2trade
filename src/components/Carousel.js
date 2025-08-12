import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Carousel({ ambassadors, indexRef }) {
  const [showCarousel, setShowCarousel] = useState();
  //   const indexRef = useRef(0);

  return (
    <div>
      {!showCarousel ? (
        <div className="relative">
          <div className="grid grid-cols-2 ">
            {[0, 1, 2, 3].map((idx) => {
              const isVisibleBeforeHide =
                indexRef.current >= idx && indexRef.current !== 4;
              const isHiding = indexRef.current === 4;

              return (
                <div
                  key={idx}
                  className={`
                     w-[150px] md-[150px]
                  md:w-[250px] md:h-[250px]
                  ${isVisibleBeforeHide ? 'opacity-100 animate-fade-in-slow-rev overflow-visible max-h-full' : ''}
                  ${isHiding && idx !== 0 ? 'opacity-100 animate-slideDown2 overflow-hidden max-h-[100px]' : ''}
                  ${isHiding && idx === 0 ? 'opacity-100 animate-revealRightSm lg:animate-revealRightLg overflow-visible animation-delay-600 absolute' : ''}
                  ${!isVisibleBeforeHide && !isHiding ? 'opacity-0 overflow-hidden max-h-0' : ''}
                `}
                  onAnimationEnd={() => {
                    if (indexRef.current === 4 && idx === 0) {
                      setShowCarousel(true);
                    }
                  }}
                >
                  <img src={ambassadors[idx].image} alt={`ambassador-${idx}`} />
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={30}
          slidesPerView={1}
          className="md:w-[500px] md:h-[500px] w-[325px] h-[325px]"
        >
          {ambassadors.map((ambassador, idx) => (
            <SwiperSlide key={idx}>
              <img
                src={ambassador.image}
                alt={`carousel-${idx}`}
                className="w-full h-full object-cover"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
