import Link from 'next/link';
import { memo, useEffect } from 'react';
import OfferCardSkeleton from './OfferCardSkeleton';
import Image from 'next/image';
import { Rating } from 'react-simple-star-rating';
import TitleRating from './TittleRating';
import UserDisplayInOffer from './UserDisplayOffer/UserDisplay';

function OfferCard({ offer, onClick, isSelected, isLoading }) {
  useEffect(() => {
    console.log(offer);
  }, [offer]);
  if (!offer || isLoading) {
    return <OfferCardSkeleton />;
  }

  return (
    <>
      <div className="flex hover:ml-1 hover:-mr-1 transition-all ">
        <div
          className={
            isSelected
              ? 'bg-red-300 w-10 h-[105px] mt-[1px] rounded-2xl absolute'
              : `hidden `
          }
        ></div>
        <button
          className={`p-4 ml-[6px] rounded-xl h-[107px] block transition-all w-full text-left z-20 bg-brighterBg  justify-between`}
          onClick={onClick}
        >
          <TitleRating offer={offer} />
          <UserDisplayInOffer offer={offer} smaller />
        </button>
      </div>
    </>
  );
}
export default memo(OfferCard);
