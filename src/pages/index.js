import 'swiper/css';
import { useEffect, useRef, useState } from 'react';
import Carousel from '@/components/ui/Carousel';
import FindOutMore from '@/components/contact/FindOutMore';
import HomePage from '@/components/home/HomePage';
import Footer from '@/components/layout/Footer';

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
  const [halfSection, setHalfSection] = useState(false);
  const [activeImg, setActiveImg] = useState([ambassadors[0].image]);
  const afterCarouselRef = useRef();
  const section3ref = useRef();
  const [isSec3, setIsSec3] = useState(false);
  const scrollLock = useRef(false);
  const carouselRef = useRef();
  const activeIndexRef = useRef(0);
  const [footerVisible, setFooterVisible] = useState();
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);
  // useEffect(() => {
  //   console.log(activeImg);
  // }, [activeImg]);
  useEffect(() => {
    const handleWheel = (e) => {
      const current = activeIndexRef.current;
      //działaj tylko powyzej lg:
      if (window.innerWidth < 1024) {
        return;
      }
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

  // useEffect(() => {
  //   console.log(indexRef.current);
  // }, [indexRef.current]);
  const indexRef = useRef(0);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    //TODO touch event handler for phone / auto timed animation
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
            return newArr;
          });
        } else {
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
    <div className={`${halfSection ? 'bg-[#efefef]' : 'bg-[#322C33]'}`}>
      {/* TODO  add max-w container so wide screen looks good*/}
      <HomePage
        halfSection={halfSection}
        carouselRef={carouselRef}
        activeIndex={activeIndex}
        ambassadors={ambassadors}
        setActiveIndex={setActiveIndex}
      />

      <FindOutMore
        halfSection={halfSection}
        setActiveIndex
        afterCarouselRef={afterCarouselRef}
      />

      <Carousel
        ambassadors={ambassadors}
        indexRef={indexRef}
        index={index}
        halfSection={halfSection}
        section3ref={section3ref}
        footerVisible={footerVisible}
      />
      {/* <ContactUs halfSection={halfSection} /> */}
      <Footer
        footerVisible={footerVisible}
        setFooterVisible={setFooterVisible}
      />
    </div>
  );
}
