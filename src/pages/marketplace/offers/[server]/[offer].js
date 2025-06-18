import axios from 'axios';
import Link from 'next/link';

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function OfferDetailPage({ selectedOffer, handleBuy }) {
  useEffect(() => {
    console.log(selectedOffer);
  }, [selectedOffer]);
  return (
    // <Layout>
    <>
      <div className="bg-mainBg p-6 flex flex-col rounded-3xl w-full ">
        <p className="mb-4">
          <strong>{selectedOffer?.title || 'title'}</strong>
        </p>
        <div className="mb-4 text-xs flex flex-col">
          <div className="mb-2 flex items-center gap-2">
            <span> Sprzedawca:</span>
            <span className="bg-brighterBg px-3 py-2  rounded-2xl">
              <Link href={`/profile/${selectedOffer?.seller.name}`}>
                <strong className="text-xs text-red-300 ">
                  {' '}
                  {selectedOffer?.seller.name}
                </strong>
              </Link>
            </span>
          </div>
          <div className="flex items-center gap-2 justify-between">
            <div>
              <span>ilość opinii:</span>
              <span className="bg-brighterBg px-3 py-2 rounded-2xl">
                <strong className="text-xs text-red-300 ">
                  {' '}
                  {selectedOffer?.seller.ratingCount}
                </strong>
              </span>
            </div>
            <div className="flex gap-4">
              <button
                value={'buy'}
                onClick={handleBuy}
                className="bg-brighterBg px-4 py-2 text-lg rounded-lg text-red-300"
              >
                kup teraz
              </button>
              <button
                value={'reserve'}
                onClick={handleBuy}
                className="bg-brighterBg px-4 py-2 text-lg rounded-lg text-red-300"
              >
                zarezerwuj
              </button>
            </div>
          </div>
        </div>
        <p className="mb-2">cennik</p>
        <div className="grid grid-cols-2">
          <div>
            {' '}
            <p className="text-sm font-bold mb-2">
              {selectedOffer?.currencyAmount} kk - {selectedOffer?.pricePLN} PLN
            </p>{' '}
          </div>
          <div>
            {' '}
            <p>
              Platnosc:{' '}
              <span className="text-xs text-red-300">
                {selectedOffer?.seller.prefPayment}
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
    // </Layout>
  );
}
