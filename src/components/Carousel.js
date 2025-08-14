import React, { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

export default function Carousel({
  ambassadors,
  indexRef,
  section3ref,
  halfSection,
}) {
  const [showCarousel, setShowCarousel] = useState(false);
  //   const indexRef = useRef(0);

  return (
    <section className="relative h-[100vh] text-white" ref={section3ref}>
      <div
        // bg-gradient-to-b from-[#54393D] to-[#141416]
        className={`absolute inset-0 
 bg-[linear-gradient(to_bottom,rgba(84,57,61,1)_0%,rgba(20,20,22,1)_60%,rgba(28,16,14,255)_100%)]
          transition-opacity duration-500 ${
            halfSection ? 'opacity-0' : 'opacity-100'
          }`}
      />
      <div
        className={`absolute inset-0 bg-[#efefef] transition-opacity duration-500 ${
          halfSection ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <div
        className={`p-4 pt-24 lg:pt-36 md:px-24 flex 2xl:flex-row flex-col-reverse 2xl:justify-between items-center 2xl:items-start transition-colors duration-500  ${
          halfSection ? 'text-black' : 'text-white'
        }`}
      >
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
                  ${isHiding && idx === 0 ? 'opacity-100 animate-revealRightSm md:animate-revealRightLg overflow-visible animation-delay-600 absolute' : ''}
                  ${!isVisibleBeforeHide && !isHiding ? 'opacity-0 overflow-hidden max-h-0' : ''}
                `}
                      onAnimationEnd={() => {
                        if (indexRef.current === 4 && idx === 0) {
                          setShowCarousel(true);
                        }
                      }}
                    >
                      <img
                        src={ambassadors[idx].image}
                        alt={`ambassador-${idx}`}
                      />
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
        <div className="font-normal relative text-3xl text-end   md:text-5xl mb-24">
          Sprawdź też nasz blog
        </div>
      </div>
    </section>
  );
}
