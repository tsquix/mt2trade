import axios from 'axios';
import Link from 'next/link';
import { Rating } from 'react-simple-star-rating';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import TitleRating from '@/components/TittleRating';
import UserDisplay from '@/components/UserDisplayOffer/UserDisplay';
import OfferDetails from '@/components/UserDisplayOffer/OfferDetails';
import DeliveryInfo from '@/components/UserDisplayOffer/DeliveryInfo';

export default function OfferDetailPage({ selectedOffer, handleBuy }) {
  useEffect(() => {
    console.log(selectedOffer);
  }, [selectedOffer]);
  return (
    // <Layout>
    <>
      <div className="bg-brighterBg p-6 flex flex-col rounded-xl w-full ">
        <TitleRating
          offer={selectedOffer}
          displayRatingNumber={true}
          className={'mb-2'}
        />
        <div className="border-t border-b border-gray-700 py-4 mb-6">
          <UserDisplay
            offer={selectedOffer}
            height={45}
            width={45}
            classNameImg={''}
          />
        </div>
        <OfferDetails selectedOffer={selectedOffer} />
        <DeliveryInfo />

        <div className="bg-mainBg rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-2">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">
                Character Name
              </label>
              <input
                type="text"
                placeholder="Enter your character name"
                className="w-full bg-brighterBg border border-gray-700 rounded-lg py-2 px-3"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            className="flex-1 bg-red-300 hover:bg-red-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
            onClick={handleBuy}
          >
            Kup teraz
          </button>
          <button className="flex-1 bg-transparent hover:bg-gray-700 text-white font-medium py-3 px-6 border border-gray-600 rounded-lg transition-colors duration-200 flex items-center justify-center">
            Zarezerwuj oferte
          </button>
        </div>
      </div>
    </>
    // </Layout>
  );
}
