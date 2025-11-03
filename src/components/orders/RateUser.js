import axios from 'axios';
import Image from 'next/image';

import { useEffect, useState } from 'react';
import { Rating } from 'react-simple-star-rating';
import ReportUser from '../ticket/ReportUser';
import Link from 'next/link';
export default function RateUser({ order }) {
  const seller = order.seller;
  const orderId = order._id;
  const [rateOk, setRateOk] = useState();
  const [rating, setRating] = useState(0);

  const handleRating = (rate) => {
    setRating(rate);
  };

  const rateUser = async (isRated) => {
    await axios.put(`/api/user/${seller.name}`, {
      newRate: rating,
    });

    updateBuyOrder(isRated);
    setRateOk('');
  };
  const updateBuyOrder = async (isRated) => {
    await axios.put('/api/buyOrder', { orderId, isRated });
    setRateOk('');
  };

  const fillColorArray = [
    '#cc4c4c', //czerwony
    '#cc7a33',
    '#d1a233',
    '#dbdb2a',
    '#a3d324', //zielony
  ];

  // useEffect(() => {
  //   console.log(order);
  // }, [order]);
  // useEffect(() => {
  //   console.log(images);
  // }, [images]);

  return (
    <>
      <div className="flex justify-center mb-4 bg-mainBg p-3 shadow-md">
        <div className="flex flex-col items-center text-white py-3 rounded-lg  w-full">
          {rateOk === undefined && order.rated === 'no' && (
            <div className="w-full max-w-md mx-auto bg-[#2a2a2a] rounded-xl shadow-lg overflow-hidden transition-all duration-300 transform hover:scale-[1.01] border border-[#333333] text-center p-2">
              <p className="mb-4">Czy transakcja przebiegła pomyślnie?</p>
              <div className="flex gap-6 justify-center">
                <button
                  className="bg-brighterBg px-6 py-2 text-lg rounded-lg text-red-300 hover:opacity-60 border border-gray-700"
                  onClick={() => setRateOk(true)}
                >
                  Tak
                </button>
                <Link
                  className="bg-red-300 text-white text-lg px-6 py-2 rounded hover:opacity-60 transition border border-red-200"
                  href={`/report?username=${seller.name}`}
                >
                  Nie
                </Link>
              </div>
            </div>
          )}
          {rateOk === true && order.rated === 'no' && (
            <>
              <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-full bg-mainBg text-red-300 z-50">
                <div className="absolute right-0 text-2xl p-6">
                  <button onClick={() => setRateOk()}>X</button>
                </div>

                <div className="flex flex-col justify-center items-center">
                  <div className="flex flex-col items-center p-6 gap-4">
                    {' '}
                    <div className="opacity-0 animate-fade-in animation-delay-400">
                      <div className="">
                        <p className="text-3xl mb-8">Oceń sprzedajacego</p>
                      </div>
                      {/* TODO FIX nie ma seller.avatar tylko static idzie*/}
                      <div className="justify-center flex">
                        <Image
                          src={`${seller?.avatar?.length > 0 ? seller?.avatar : 'https://mt2trade.s3.amazonaws.com/1761741585332.jpg'}`}
                          width={232}
                          height={232}
                          className="p-4 bg-brighterBg rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="opacity-0 animate-fade-in animation-delay-400 ">
                      <p className="">{seller.name}</p>
                    </div>
                    <div className="opacity-0 animate-fade-in animation-delay-800">
                      <p className="">
                        Średnia ocena tego użytkownika: {seller.userRating} / 5
                      </p>
                    </div>
                  </div>
                  <div className="mb-8 opacity-0 animate-fade-in animation-delay-800 items-center justify-center text-center">
                    <Rating
                      onClick={handleRating}
                      SVGclassName="inline"
                      fillColor={'red'}
                      size={50}
                      transition
                      showTooltip
                      fillColorArray={fillColorArray}
                      tooltipDefaultText="Ocena"
                      titleSeparator="z"
                    />
                  </div>
                  <div>
                    <div className="flex flex-col gap-4">
                      <button
                        onClick={() => rateUser('yes')}
                        className="px-6 py-3 bg-brighterBg rounded-lg hover:opacity-75 opacity-0 animate-fade-in animation-delay-1200"
                      >
                        Wystaw ocene
                      </button>
                      <button
                        onClick={() => updateBuyOrder('skipped')}
                        className="px-6 py-3 bg-brighterBg rounded-lg hover:opacity-75 opacity-0 animate-fade-in animation-delay-1200"
                      >
                        Nie oceniaj
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* {rateOk === false && order.rated === 'no' && (
            <ReportUser
              seller={seller}
              setRateOk={setRateOk}
              orderId={orderId}
            />
          )} */}
        </div>
      </div>
    </>
  );
}
