import { memo, useEffect, useState } from 'react';

export default function FindOutMore({ halfSection, afterCarouselRef }) {
  const Counter = memo(function Counter({ docelowa }) {
    const [started, setStarted] = useState(false);
    useEffect(() => {
      if (halfSection && !started) {
        setStarted(true);
      }
    }, [halfSection, started]);
    return (
      <span className="px-2 text-sm inline-block">
        <style>{`
          @keyframes countUp {
            from { --num: 0; }
            to { --num: ${docelowa}; }
          }
          @property --num {
            syntax: '<integer>';
            initial-value: 0;
            inherits: false;
          }
          .counter-animate {
            animation: countUp 2s ease-out forwards;
            counter-reset: num var(--num);
          }
          .counter-animate::after {
            content: counter(num);
          }
        `}</style>
        <span className={started ? 'counter-animate' : ''}>
          {started ? '' : '0'}
        </span>
      </span>
    );
  });
  useEffect(() => {
    console.log(halfSection);
  }, [halfSection]);

  return (
    <div className="relative h-[150vh] lg:h-[175vh] " ref={afterCarouselRef}>
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

      <section
        className={`${halfSection ? 'text-[#333333]' : 'text-white'} flex md:px-24 lg:pt-36 xl:py-48 mx-auto max-w-7xl justify-center`}
      >
        <div className="p-4 xl:grid xl:grid-cols-[0.5fr_1.5fr] gap-24 ">
          <div
            className={`font-normal sticky top-24 z-0 mb-24 md:mb-24 px-2 md:px-0`}
          >
            {/* <p className="text-5xl">z nami nie zginiesz zobacz</p>
                 <p className="text-5xl">z nami nie zginiesz zobacz</p>
                <p className="text-5xl">juz teraz jak nie być</p>
                <p className="text-5xl mb-4">biedny w metin2</p> */}
            <p className="text-2xl lg:text-5xl">Lorem ipsum dolor sit amet</p>
            <p className="text-2xl lg:text-5xl">
              consectetur adipisicing elit.
            </p>
            <p className="text-2xl lg:text-5xl">Odio natus amet, </p>
            <p className="text-2xl lg:text-5xl mb-4">sapiente </p>
            <button
              className={`${halfSection ? 'border-black' : 'border-white'} bg-transparent border  px-3 rounded-xl  hover:text-white hover:bg-black py-3 transition-all`}
            >
              Dowiedz się więcej -&gt;
            </button>
          </div>
          <div
            className={` font-bold p-12 gap-16 lg:gap-24 xl:gap-36 ${halfSection ? 'text-black bg-white ' : 'text-white  opacity-0 animate-fade-in bg-gradient-to-b from-[#141416] to-[#54393D] transition-opacity  '} grid grid-cols-2 shadow-xl relative z-10 mb-12 `}
          >
            {' '}
            <div
              className={`items-center flex flex-col justify-center opacity-0 ${halfSection ? 'text-[#333333] animate-fade-in' : 'text-white opacity-100'} text-xl  p-4`}
            >
              <h4 className=""> Ipsam ducimus, </h4>
              <p className="text-sm"> ab,earum</p>
            </div>
            <div
              className={`items-center flex flex-col justify-center opacity-0 ${halfSection ? 'text-[#333333] animate-fade-in' : 'text-white opacity-100'} text-xl p-4`}
            >
              <p> Ipsam ducimus,</p>
              <p className="text-sm"> ab,earum</p>
            </div>
            <div
              className={`items-center flex flex-col   justify-center opacity-0 ${halfSection ? 'text-[#333333] animate-fade-in' : 'text-white'} text-lg lg:text-xl p-4`}
            >
              <p className="">zaufanych klientów:</p>

              <Counter docelowa={182} />
            </div>
            <div
              className={`items-center flex flex-col   justify-center opacity-0 ${halfSection ? 'text-[#333333] animate-fade-in' : 'text-white'} text-lg lg:text-xl p-4`}
            >
              <p>ratione at? </p>
              <p className="text-sm"> ab,earum</p>
            </div>
          </div>
          <div></div>
          <div
            className={` font-bold  p-12  ${halfSection ? 'text-black bg-white' : 'text-white  bg-gradient-to-b from-[#141416] to-[#54393D] transition-opacity duration-500'} grid grid-cols-2 shadow-md relative z-10 mb-12 gap-16 xl:gap-36 lg:gap-24 `}
          >
            {' '}
            <div
              className={`items-center flex flex-col justify-center opacity-0 ${halfSection ? 'text-[#333333] animate-fade-in' : 'text-white opacity-100'} text-xl  p-4`}
            >
              <p> Ipsam ducimus, ab,</p>
              <p className="text-sm"> earum</p>
            </div>
            <div
              className={`items-center flex flex-col justify-center opacity-0 ${halfSection ? 'text-[#333333] animate-fade-in' : 'text-white opacity-100'} text-xl  p-4`}
            >
              <p> Ipsam ducimus, ab,</p>
              <p className="text-sm"> earum</p>
            </div>
            <div
              className={`items-center flex flex-col justify-center opacity-0 ${halfSection ? 'text-[#333333] animate-fade-in' : 'text-white opacity-100'} text-xl  p-4`}
            >
              <p> Ipsam ducimus, ab,</p>
              <p className="text-sm"> earum</p>
            </div>
            <div
              className={`items-center flex flex-col justify-center opacity-0 ${halfSection ? 'text-[#333333] animate-fade-in' : 'text-white opacity-100'} text-xl  p-4`}
            >
              <p> Ipsam ducimus, ab,</p>
              <p className="text-sm"> earum</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
