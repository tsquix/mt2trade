import Carousel from '@/components/Carousel';
import FindOutMore from '@/components/FindOutMore';
import HomePage from '@/components/HomePage';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';

export default function Home() {
  const ambassadors = [
    {
      name: 'hajda',
      image:
        'https://yt3.googleusercontent.com/ytc/AIdro_lSII5tQr5gJSqhkHsuqY-pi_02vhUSB-T2sGxB9E_b1Lk=s900-c-k-c0x00ffffff-no-rj',
      quote: 'Metin to nie tylko pasja',
    },
    {
      name: 'jolka2007',
      image:
        'https://yt3.googleusercontent.com/sVueJ9h9_X7TwPf5cS6JMYF8bojjqE8wm1VVF-zj6aoGmtlw_6g32J1dLU7xnMDzQpWu9WmmtA=s900-c-k-c0x00ffffff-no-rj',
      quote: 'Uwielbiam handel yang',
    },
    {
      name: 'chmurson',
      image: 'https://mt2trade.s3.eu-north-1.amazonaws.com/1754493019921.png',
      quote: 'Rybki i yangi to to co lubie',
    },
    {
      name: 'chmurson',
      image: 'https://mt2trade.s3.eu-north-1.amazonaws.com/1754493019921.png',
      quote: 'serio',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(null);
  const [animate, setAnimate] = useState(false);
  const [halfSection, setHalfSection] = useState(true);
  const [activeImg, setActiveImg] = useState([ambassadors[0].image]);
  const afterCarouselRef = useRef();
  const section3ref = useRef();
  const [isSec3, setIsSec3] = useState(false);
  const scrollLock = useRef(false);
  const carouselRef = useRef();
  const activeIndexRef = useRef(0);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);
  useEffect(() => {
    console.log(activeImg);
  }, [activeImg]);
  useEffect(() => {
    const handleWheel = (e) => {
      const current = activeIndexRef.current;

      // zablokuj karuzelę tylko jeśli aktywny jest 0–2
      if (current !== 3 && current !== 4) {
        e.preventDefault();
        if (scrollLock.current) return;
        scrollLock.current = true;

        setTimeout(() => {
          scrollLock.current = false;
        }, 500);

        if (e.deltaY > 0) {
          setActiveIndex((prev) => {
            if (prev === null) return 0;
            return Math.min(prev + 1, 3);
          });
        } else {
          setActiveIndex((prev) => {
            if (prev === null || prev === 0) return null;
            return prev - 1;
          });
        }
      }

      if (current === 3) {
        scrollLock.current = true;

        setTimeout(() => {
          scrollLock.current = false;
        }, 800);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, [ambassadors.length]);

  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    console.log(indexRef.current);
  }, [indexRef.current]);
  useEffect(() => {
    const handleWheel2 = (e) => {
      if (!isSec3) return;
      if (indexRef.current !== 4) {
        e.preventDefault();
      }
      if (scrollLock.current) return;

      scrollLock.current = true;

      setTimeout(() => {
        scrollLock.current = false;
      }, 200);

      if (e.deltaY > 0) {
        if (indexRef.current >= ambassadors.length) {
          scrollLock.current = false;
          return;
        }

        if (activeImg.length > 1) {
          setActiveImg((prev) => {
            const newArr = [...prev];
            newArr.shift();
            newArr.push(ambassadors[indexRef.current]?.image);
            setAnimate(true);
            return newArr;
          });
        } else {
          setAnimate(true);
          setActiveImg((prev) => [
            ...prev,
            ambassadors[indexRef.current]?.image,
          ]);
        }

        indexRef.current = indexRef.current + 1;
        if (indexRef.current === 4) {
          setIndex(4);
        }
      } else {
        // obsługa scrolla w gore
      }
    };

    window.addEventListener('wheel', handleWheel2, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleWheel2);
    };
  }, [isSec3, ambassadors, activeImg]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setActiveIndex(4);
          setHalfSection(true);
        } else {
          setHalfSection(false);
        }
      },
      {
        root: null,
        threshold: 0.37,
      }
    );

    if (afterCarouselRef.current) {
      observer.observe(afterCarouselRef.current);
    }

    return () => {
      if (afterCarouselRef.current) {
        observer.unobserve(afterCarouselRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!section3ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          console.log('section3ref jest widoczny');
          setIsSec3(true);
        } else {
          console.log('section3ref NIE jest widoczny');
          setIsSec3(false);
        }
      },
      {
        root: null,
        threshold: 0.9,
      }
    );

    observer.observe(section3ref.current);

    return () => {
      if (section3ref.current) {
        observer.unobserve(section3ref.current);
      }
    };
  }, [section3ref]);

  return (
    <>
      <div className="bg-[#efefef]">
        <HomePage
          halfSection={halfSection}
          carouselRef={carouselRef}
          activeIndex={activeIndex}
          ambassadors={ambassadors}
          setActiveIndex={setActiveIndex}
        />
        <section className="bg-[linear-gradient(to_bottom,rgba(20,20,22,1)_0%,rgba(84,57,61,1)_50%,rgba(20,20,22,1)_100%)] relative h-[100vh] z-10 lg:hidden ">
          <div className="relative text-white font-bold text-2xl w-full h-full flex flex-col justify-center items-center overflow-hidden">
            <div
              className={`absolute inset-0 bg-[#efefef] transition-opacity duration-500 ${
                halfSection ? 'opacity-100' : 'opacity-0'
              }`}
            ></div>
            <h1 className="animate-fade-in opacity-0 animation-delay-1800 mb-32 text-3xl font-bold">
              Ambasadorzy
            </h1>
            <Swiper
              spaceBetween={30}
              slidesPerView={1}
              modules={[Autoplay, Pagination]}
              autoplay={{ delay: 3000, disableOnInteraction: false }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1440: { slidesPerView: 4 },
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

        <div
          className="relative h-[200vh] lg:h-[150vh] "
          ref={afterCarouselRef}
        >
          <div
            className={`absolute inset-0 bg-gradient-to-b from-[#141416] to-[#54393D] transition-opacity duration-500 ${
              halfSection ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <div
            className={`  absolute inset-0 bg-[#efefef] transition-opacity duration-500 ${
              halfSection ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <FindOutMore halfSection={halfSection} setActiveIndex />
        </div>

        <section className="relative h-[100vh] text-white" ref={section3ref}>
          <div
            className={`absolute inset-0 bg-gradient-to-b from-[#54393D] to-[#141416] transition-opacity duration-500 ${
              halfSection ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <div
            className={`absolute inset-0 bg-[#efefef] transition-opacity duration-500 ${
              halfSection ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <div
            className={` p-4 pt-24 lg:pt-36 md:px-24 flex 2xl:flex-row flex-col-reverse 2xl:justify-between items-center 2xl:items-start transition-colors duration-500  ${
              halfSection ? 'text-black' : 'text-white'
            }`}
          >
            <Carousel
              ambassadors={ambassadors}
              indexRef={indexRef}
              index={index}
            />

            <div className="font-normal relative text-3xl text-end   md:text-5xl mb-24">
              Sprawdź też nasz blog
            </div>
          </div>
        </section>
        <section className="relative h-[100vh] text-white bg-green-200">
          <div
            className={` p-4 pt-36 px-24 flex justify-between items-start transition-colors duration-500  ${
              halfSection ? 'text-black' : 'text-white'
            }`}
          ></div>
        </section>
      </div>
    </>
  );
}
