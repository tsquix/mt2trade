import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import ContactForm from './ContactForm';

export default function Footer({ footerVisible, setFooterVisible }) {
  const footerRef = useRef();

  useEffect(() => {
    if (!footerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          console.log('footerRef jest widoczny');

          setFooterVisible(true);
        } else {
          console.log('footerRef NIE jest widoczny');
        }
      },
      {
        root: null,
        threshold: 0.8,
      }
    );

    observer.observe(footerRef.current);

    return () => {
      if (footerRef.current) {
        observer.unobserve(footerRef.current);
      }
    };
  }, [footerRef]);
  return (
    <section
      className="relative h-[800px] bg-none "
      style={{ clipPath: 'polygon(0% 0, 100% 0%, 100% 100%, 0 100%)' }}
      ref={footerRef}
    >
      <div className="relative h-[calc(100vh+800px)] -top-[100vh]">
        <div className="h-[800px] sticky top-[calc(100vh-800px)]">
          <div className="z-0 absolute inset-0">
            <Image
              src="https://mt2trade.s3.amazonaws.com/1755185565986.webp"
              alt=""
              fill
              className="object-cover transition-opacity duration-500 ease-in-out"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>

          <div className="grid md:grid-cols-[1fr_2fr_1fr]  grid-cols-[.3fr_1.5fr_.3fr] relative h-full w-full z-10">
            {/* lewa kolumna */}
            <div
              className={`bg-cover bg-no-repeat -translate-y-full ${footerVisible ? 'animate-slideUpNeg44' : ''} animation-delay-400`}
              style={{
                backgroundImage: `url(https://mt2trade.s3.amazonaws.com/1755185565986.webp)`,
                backgroundPosition: 'left top',
                backgroundSize: 'cover',
                filter: 'blur(.5rem)',
              }}
            ></div>

            {/* srodkowa */}
            <div
              className={`bg-cover bg-no-repeat -translate-y-full ${footerVisible ? 'animate-slideUp0' : ''} animation-delay-200`}
              style={{
                backgroundImage: `url(https://mt2trade.s3.amazonaws.com/1755185565986.webp)`,
                backgroundPosition: 'center center',
                backgroundSize: 'cover',
              }}
            >
              <div
                className={`${footerVisible ? 'animate-fade-in-slow-rev' : ''}  opacity-0`}
              >
                <ContactForm />
              </div>
            </div>

            {/* prawa kolumna */}
            <div
              className={`bg-cover bg-no-repeat -translate-y-full  ${footerVisible ? 'animate-slideUp44' : ''}`}
              style={{
                backgroundImage: `url(https://mt2trade.s3.amazonaws.com/1755185565986.webp)`,
                backgroundPosition: 'right bottom',
                backgroundSize: 'cover',
                filter: 'blur(.5rem)',
              }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}
