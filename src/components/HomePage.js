import Image from 'next/image';
import Header from './Header';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import { useEffect, useRef } from 'react';
export default function HomePage({
  halfSection,
  activeIndex,
  carouselRef,
  ambassadors,
  setActiveIndex,
}) {
  halfSection;
  const gridTemplate = [
    'lg:grid-cols-[2fr_1fr_1fr_1fr]',
    'grid-cols-[1fr_2fr_1fr_1fr]',
    'grid-cols-[1fr_1fr_2fr_1fr]',
    'grid-cols-[1fr_1fr_1fr_2fr]',
    'grid-cols-[1fr_1fr_1fr_1fr]',
  ];
  const swiperRef = useRef(null);
  useEffect(() => {
    if (!swiperRef.current || !swiperRef.current.swiper) return;
    if (!halfSection) {
      swiperRef.current.swiper.allowTouchMove = true;
      //change to swipe instead of auto change when not visible to not rerender
    }
  }, [halfSection]);
  return (
    <>
      <section className="h-[100vh]">
        <Header noMb fadeIn />
        <div
          className={`${halfSection ? 'bg-[#efefef]' : ''} z-0 transition-colors duration-500 ease-in-out `}
        >
          <Image
            src="https://mt2trade.s3.eu-north-1.amazonaws.com/76a89c6b-61ac-4f50-ad08-5b72ec0b4232.webp"
            alt=""
            fill
            className={`object-cover transition-opacity duration-500 ease-in-out ${
              halfSection ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <div
            className={`absolute inset-0 animate-fade-in-slow z-0  ${
              halfSection ? '' : 'bg-black '
            }`}
          />
          <div className="absolute inset-0 flex justify-center items-center justify-items-center z-10">
            <div className="flex flex-col lg:absolute lg:left-24 lg:top-1/3 lg:-translate-y-1/2 z-10 text-white px-6 lg:px-0">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 backdrop-blur-xl bg-black/10"></div>
                {/* Blurred background layer */}

                {/* Foreground content */}
                <div className="relative mb-4 z-10">
                  <h1 className="text-3xl lg:text-4xl font-bold mb-4 sm:mb-6 overflow-hidden max-h-0 animate-slideDown tracking-wide [text-shadow:_2px_2px_4px_rgba(0,0,0,0.8)] animation-delay-800">
                    Metin2Trade
                  </h1>
                  <div className="overflow-hidden max-h-0 animate-slideDown animation-delay-800">
                    <h3 className="text-lg font-bold tracking-tight sm:tracking-normal">
                      Twój nowy ulubiony sposób handlu
                    </h3>
                  </div>
                  <div className="overflow-hidden max-h-0 animate-slideDown animation-delay-800 tracking-tight sm:tracking-normal">
                    Sprzedawaj oraz kupuj od zaufanych handlarzy
                  </div>
                  <div className="overflow-hidden max-h-0 animate-slideDown animation-delay-800 tracking-tight sm:tracking-normal">
                    Handel yang nigdy nie był jeszcze tak prosty
                  </div>
                </div>
              </div>

              <div className=" gap-6 sm:gap-4 flex overflow-hidden opacity-0 animate-fade-in animation-delay-1200 justify-center">
                <button className="bg-white text-sm sm:text-base px-2 sm:px-3 rounded-xl text-black hover:bg-gray-300 py-3">
                  Dowiedz się więcej
                </button>
                <button>
                  <div
                    className="
                   text-sm sm:text-base px-2 sm:px-5 rounded-xl py-3 text-gray-300 relative 
                    bg-gradient-to-r from-[#322C33] to-[#603339]
                    hover:from-[#423a43] hover:to-[#6c3b41]
                     "
                  >
                    <div className="shiningButton">Sprawdź serwery</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
          <div className="absolute inset-0"> </div>
          <div
            className={`absolute inset-0 animate-fade-in-slow z-0 ${
              halfSection ? '' : 'bg-black '
            }`}
          />{' '}
        </div>
        <div
          className="absolute top-[100%] lg:top-[55%] z-10 text-white font-bold text-2xl w-full items-center justify-items-center overflow-hidden hidden lg:block"
          ref={carouselRef}
        >
          {' '}
          <h1 className="animate-fade-in opacity-0 animation-delay-1800 my-12 lg:mb-16 lg:mt-0 lg:text-3xl font-bold">
            Ambasadorzy
          </h1>
          <div
            className={`grid ${
              activeIndex !== null
                ? gridTemplate[activeIndex]
                : 'grid-cols-[1fr_1fr_1fr_1fr]'
            } transition-[grid-template-columns] duration-500 gap-fluid ${
              halfSection ? 'text-black' : 'text-white'
            }`}
          >
            {/* animate-leftSlide translate-x-[150%] animation-delay-1200 */}
            {ambassadors.map((amb, index) => (
              <div
                className={`flex flex-col items-center logo opacity-0  ${halfSection ? 'shadow-xl' : ''} `}
                key={index}
              >
                <h2
                  className={`transition-transform duration-500 animate-fade-in-slow-rev animation-delay-1600 opacity-0 `}
                >
                  {/* ${index === activeIndex ? 'opacity-0' : 'opacity-100'} */}
                  {amb.name}
                </h2>
                <div
                  className={`transition-transform duration-500 ${index === activeIndex ? 'xl:scale-150 lg:scale-130 scale-120' : 'scale-100'} p-8 `}
                >
                  <Image
                    src={amb.image}
                    width={150}
                    height={150}
                    className="rounded-full z-0"
                    alt=""
                  />
                  <div
                    className={`absolute inset-0  z-0 rounded-full bg-black ${halfSection ? 'opacity-0' : 'opacity-20'} scale-75`}
                  />
                  <div
                    className={`absolute inset-0  -z-10  p-3 rounded-xl transition-transform duration-500 ${halfSection ? 'bg-white ' : 'opacity-20'}`}
                  />
                </div>
                <p
                  className={`absolute bottom-0 text-white transition-opacity duration-500 ${index === activeIndex ? 'opacity-100' : 'opacity-0'} z-10 text-nowrap text-md `}
                >
                  {amb.quote}
                </p>
              </div>
            ))}
          </div>
          <div className="relative animate-fade-in-slow-rev animation-delay-600 opacity-0 z-10">
            <button
              className={`flex items-center justify-items-center justify-center ${activeIndex === 4 ? 'animate-fade-out-slow' : ''}`}
              onClick={() => setActiveIndex(4)}
            >
              <div className="w-4 h-4 bg-white animate-ping blur-sm absolute top-1/2 translate-x-1/2"></div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-12 animate-pulse "
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
                />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* abassadors swiper for tablets / mobile */}
      <section className="bg-[linear-gradient(to_bottom,rgba(20,20,22,1)_0%,rgba(84,57,61,1)_50%,rgba(20,20,22,1)_100%)] relative h-[100vh] z-10 lg:hidden ">
        <div className="relative text-white font-bold text-2xl w-full h-full flex flex-col justify-center items-center overflow-hidden">
          <div
            className={`absolute inset-0 bg-[#efefef] transition-opacity duration-500 ${
              halfSection ? 'opacity-100' : 'opacity-0'
            }`}
          ></div>
          <h1 className="animate-fade-in opacity-0 animation-delay-1800 mb-24 text-3xl font-bold">
            Ambasadorzy
          </h1>
          <Swiper
            ref={swiperRef}
            spaceBetween={30}
            slidesPerView={1}
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className={`${halfSection ? 'text-black' : 'text-white'} w-full max-w-[1400px]`}
          >
            {ambassadors.map((amb, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`flex flex-col items-center logo ${
                    halfSection ? 'shadow-xl' : ''
                  }`}
                >
                  <h2 className="transition-transform duration-500 animate-fade-in-slow-rev animation-delay-1600 opacity-0">
                    {amb.name}
                  </h2>
                  <div className="relative w-[150px] h-[150px] transition-transform duration-500 hover:scale-110 p-8">
                    <Image
                      src={amb.image}
                      alt=""
                      fill
                      className="rounded-full object-cover z-0"
                    />
                    <div
                      className={`absolute inset-0 rounded-full bg-black ${
                        halfSection ? 'opacity-0' : 'opacity-20'
                      }`}
                    />
                    <div
                      className={`absolute inset-0 -z-10 p-3 rounded-xl transition-transform duration-500 ${
                        halfSection ? 'bg-white' : 'opacity-20'
                      }`}
                    />
                  </div>

                  <p className="mt-4 text-center text-md opacity-80">
                    {amb.quote}
                  </p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
}
