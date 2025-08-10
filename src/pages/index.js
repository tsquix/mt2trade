import Header from '@/components/Header';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

export default function Home() {
  function Counter({ docelowa }) {
    const [liczba, setLiczba] = useState(0);

    useEffect(() => {
      if (liczba < docelowa) {
        const timer = setTimeout(() => {
          setLiczba(liczba + 1);
        }, 20); // increase liczba every 200ms

        return () => clearTimeout(timer); // cleanup on unmount or liczba change
      }
    }, [liczba, docelowa]);

    return <span className="px-2">{liczba}</span>;
  }
  const ambassadors = [
    {
      name: 'hajda',
      image:
        'https://yt3.googleusercontent.com/ytc/AIdro_lSII5tQr5gJSqhkHsuqY-pi_02vhUSB-T2sGxB9E_b1Lk=s900-c-k-c0x00ffffff-no-rj',
      quote: 'Bo metin to nie tylko pasja',
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

  const gridTemplate = [
    'grid-cols-[2fr_1fr_1fr_1fr]',
    'grid-cols-[1fr_2fr_1fr_1fr]',
    'grid-cols-[1fr_1fr_2fr_1fr]',
    'grid-cols-[1fr_1fr_1fr_2fr]',
    'grid-cols-[1fr_1fr_1fr_1fr]',
  ];
  const [activeIndex, setActiveIndex] = useState(null);
  const [halfSection, setHalfSection] = useState(false);
  const afterCarouselRef = useRef();
  const scrollLock = useRef(false);
  const carouselRef = useRef();
  const activeIndexRef = useRef(0);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);
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
            if (prev === null) return 0; // pierwszy scroll w dół zaznacza 0
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          setActiveIndex(4); // użytkownik zszedł niżej → koniec karuzeli
          setHalfSection(true);
        } else {
          // Użytkownik się cofnął — wyszedł z sekcji
          setHalfSection(false);
        }
      },
      {
        root: null, // viewport
        threshold: 0.37, // połowa sekcji musi być widoczna
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
  return (
    <>
      <div className="bg-[#efefef]">
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
            <div className="absolute inset-0 ">
              <div
                className={`absolute inset-0 animate-fade-in-slow z-0 ${
                  halfSection ? '' : 'bg-black '
                }`}
              />
              <div className="absolute left-24 top-1/3 -translate-y-1/2 z-10 text-white">
                <div className="mb-4">
                  <h1 className="text-4xl font-bold mb-6 overflow-hidden max-h-0 animate-slideDown">
                    Metin2Trade
                  </h1>
                  <div className="overflow-hidden max-h-0 animate-slideDown">
                    <h3 className="text-lg font-bold  ">
                      Twój nowy ulubiony sposób handlu
                    </h3>
                  </div>
                  <div className="overflow-hidden max-h-0 animate-slideDown">
                    Sprzedawaj oraz kupuj od zaufanych handlarzy
                  </div>
                  <div className="overflow-hidden max-h-0 animate-slideDown">
                    Handel yang nigdy nie był jeszcze tak prosty
                  </div>
                </div>
                <div className="gap-4 flex overflow-hidden  opacity-0 animate-fade-in animation-delay-1200">
                  <button className="bg-white px-3 rounded-xl text-black hover:bg-gray-300 py-3">
                    Dowiedz się więcej
                  </button>
                  <button>
                    <div
                      className="
                    px-5 rounded-xl py-[10px] text-gray-300 relative 
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
            className="absolute top-[55%] z-10 text-white font-bold text-2xl w-full items-center justify-items-center overflow-hidden "
            ref={carouselRef}
          >
            {' '}
            <h1 className="animate-fade-in opacity-0 animation-delay-1800 mb-16 text-3xl font-bold">
              Ambasadorzy
            </h1>
            <div
              className={`grid ${activeIndex !== null ? gridTemplate[activeIndex] : 'grid-cols-[1fr_1fr_1fr_1fr]'} transition-[grid-template-columns] duration-500 gap-44 ${
                halfSection ? 'text-black' : 'text-white '
              } `}
            >
              {/* animate-leftSlide translate-x-[150%] animation-delay-1200 */}
              {ambassadors.map((amb, index) => (
                <div
                  className={`flex flex-col items-center blurSlide logo opacity-0  ${halfSection ? 'shadow-xl' : ''} `}
                  key={index}
                >
                  <h2
                    className={`transition-transform duration-500 animate-fade-in-slow-rev animation-delay-1600 opacity-0 `}
                  >
                    {/* ${index === activeIndex ? 'opacity-0' : 'opacity-100'} */}
                    {amb.name}
                  </h2>
                  <div
                    className={`transition-transform duration-500 ${index === activeIndex ? 'scale-150' : 'scale-100'} p-8 `}
                  >
                    <Image
                      src={amb.image}
                      width={150}
                      height={150}
                      className="rounded-full  z-0"
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
                    className={`absolute bottom-0 text-white transition-opacity duration-500 ${index === activeIndex ? 'opacity-100' : 'opacity-0'} z-10 text-nowrap `}
                  >
                    {amb.quote}
                  </p>
                </div>
              ))}
            </div>
            <div className="relative animate-fade-in-slow-rev animation-delay-600 opacity-0">
              <button
                className={`flex items-center justify-items-center justify-center ${activeIndex === 4 ? 'animate-fade-out-slow' : ''}`}
                onClick={() => setActiveIndex(4)}
              >
                <div className="w-4 h-4 bg-white animate-ping blur-sm absolute top-1/2 translate-x-1/2"></div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="size-12 animate-pulse "
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m4.5 5.25 7.5 7.5 7.5-7.5m-15 6 7.5 7.5 7.5-7.5"
                  />
                </svg>
              </button>
            </div>
          </div>
        </section>
        <div className="relative h-[150vh]" ref={afterCarouselRef}>
          <div
            className={`absolute inset-0 bg-gradient-to-b from-[#141416] to-[#54393D] transition-opacity duration-500 ${
              halfSection ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <div
            className={`absolute inset-0 bg-[#efefef] transition-opacity duration-500 ${
              halfSection ? 'opacity-100' : 'opacity-0'
            }`}
          />

          <section
            className={`${halfSection ? 'text-[#333333]' : 'text-white'} flex px-24 `}
          >
            <div className="p-4 mt-48 grid grid-cols-2 gap-24 items-start">
              <div className="font-normal sticky top-24 self-start">
                {/* <p className="text-5xl">z nami nie zginiesz zobacz</p>
                 <p className="text-5xl">z nami nie zginiesz zobacz</p>
                <p className="text-5xl">juz teraz jak nie być</p>
                <p className="text-5xl mb-4">biedny w metin2</p> */}
                <p className="text-5xl">Lorem ipsum dolor sit amet</p>
                <p className="text-5xl">consectetur adipisicing elit.</p>
                <p className="text-5xl">Odio natus amet, </p>
                <p className="text-5xl mb-4">sapiente </p>
                <button className="bg-transparent border border-black px-3 rounded-xl  hover:text-white hover:bg-black py-3 transition-all">
                  Dowiedz się więcej -&gt;
                </button>
                <p></p>
              </div>
              <div
                className={` font-bold p-12 gap-36 ${halfSection ? 'text-black bg-white' : 'text-white '} grid grid-cols-2 shadow-xl relative z-10 mb-12`}
              >
                {' '}
                <div
                  className={`items-center flex flex-col   justify-center opacity-0 ${halfSection ? 'text-[#333333] animate-fade-in' : 'text-white'} text-xl  `}
                >
                  <p>tyle użytkowników mamy </p>
                  <p>na stronie</p>
                  <Counter docelowa={100} />
                </div>
                <div
                  className={`items-center flex flex-col   justify-center opacity-0 ${halfSection ? 'text-[#333333] animate-fade-in' : 'text-white'} text-xl `}
                >
                  <p>tyle transakcji już</p>
                  <p>przeprowadziliśmy</p>
                  <Counter docelowa={150} />
                </div>
                <div
                  className={`items-center flex flex-col   justify-center opacity-0 ${halfSection ? 'text-[#333333] animate-fade-in' : 'text-white opacity-100'} text-xl `}
                >
                  <p> Ipsam ducimus, ab,</p>
                  <p> earum, obcaecati</p>
                </div>
                <div
                  className={`items-center flex flex-col justify-center opacity-0 ${halfSection ? 'text-[#333333] animate-fade-in' : 'text-white opacity-100'} text-xl`}
                >
                  <p>Lorem ipsum dolor sit amet consectetur </p>
                </div>
              </div>
              <div></div>
              <div
                className={` font-bold p-12 gap-36 ${halfSection ? 'text-black bg-white' : 'text-white '} grid grid-cols-2 shadow-xl relative z-10 mb-12`}
              >
                {' '}
                <div
                  className={`items-center flex flex-col justify-center opacity-0 ${halfSection ? 'text-[#333333] animate-fade-in' : 'text-white'} text-xl  `}
                >
                  <p> Ipsam ducimus, ab,</p>
                  <p> earum, obcaecati</p>
                </div>
                <div
                  className={`items-center flex flex-col justify-center opacity-0 ${halfSection ? 'text-[#333333] animate-fade-in' : 'text-white'} text-xl `}
                >
                  <p> Ipsam ducimus, ab,</p>
                  <p> earum, obcaecati</p>
                </div>
                <div
                  className={`items-center flex flex-col justify-center opacity-0 ${halfSection ? 'text-[#333333] animate-fade-in' : 'text-white opacity-100'} text-xl `}
                >
                  <p> Ipsam ducimus, ab,</p>
                  <p> earum, obcaecati</p>
                </div>
                <div
                  className={`items-center flex flex-col justify-center opacity-0 ${halfSection ? 'text-[#333333] animate-fade-in' : 'text-white opacity-100'} text-xl`}
                >
                  <p> Ipsam ducimus, ab,</p>
                  <p> earum, obcaecati</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section
          className="relative h-[100vh] text-white"
          // ref={section3Ref}
        >
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
            className={` p-4 pt-36 px-24 flex justify-between items-start transition-colors duration-500  ${
              halfSection ? 'text-black' : 'text-white'
            }`}
          >
            <div
              // ref={galleryRef}
              className="h-[100vh] overflow-y-auto border border-gray-300 rounded p-4 w-1/2 relative hscroll-snap-y-mandatory"
            >
              <ul className="">
                <li className="p-2 w-[800px] h-[400px] flex items-center justify-center scroll-snap-align-start"></li>
                {/* {Array.from({ length: 4 }).map((_, i) => ( */}
                <li className="p-2 bg-gray-100 rounded w-[800px] h-[400px] flex items-center justify-center scroll-snap-align-start my-24">
                  Item
                </li>
                <li className="p-2 bg-gray-100 rounded w-[800px] h-[400px] flex items-center justify-center scroll-snap-align-start my-24">
                  Item
                </li>
                <li className="p-2 bg-gray-100 rounded w-[800px] h-[400px] flex items-center justify-center scroll-snap-align-start my-24">
                  Item
                </li>
                <li className="p-2 bg-gray-100 rounded w-[800px] h-[400px] flex items-center justify-center scroll-snap-align-start my-24">
                  Item
                </li>
                {/* ))} */}
              </ul>
            </div>
            <div className="font-normal top-1/4 self-start relative text-5xl">
              Sprawdź też nasz blog
            </div>
          </div>
        </section>
        <section
          className="relative h-[100vh] text-white bg-green-200"
          // ref={section3Ref}
        >
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
