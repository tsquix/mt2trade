import Image from 'next/image';
import { Rating } from 'react-simple-star-rating';
import UserDisplayInOffer from './UserDisplayOffer/UserDisplay';

export default function TitleRating({ offer, displayRatingNumber, className }) {
  return (
    <div className={className}>
      <div className="flex justify-between">
        <div className="bg-brighterBg ">
          <div className="">
            <strong>{offer?.title}</strong>
          </div>
          <div className="flex ">
            <div className="flex">
              <div className="text-sm font-bold ">
                <div
                  className={`flex items-center ${displayRatingNumber ? 'gap-3' : 'gap-2'}`}
                >
                  <div className="mb-1 items-center justify-center text-center">
                    <Rating
                      readonly
                      SVGclassName="inline"
                      initialValue={offer?.seller?.userRating}
                      allowFraction
                      size={17}
                    />
                  </div>
                  {displayRatingNumber && (
                    <p className="text-xs text-white">
                      {offer?.seller?.userRating}
                    </p>
                  )}

                  <p className="text-xs text-lightGray">
                    {' '}
                    ({offer?.seller?.transactionCount} sales)
                  </p>
                </div>

                {/* <span className="text-gray-300">{offer?.description}</span> */}
              </div>
            </div>
          </div>
        </div>
        <div className="bg-brighterBg text-right">
          <p className="text-red-300">
            {offer.currencyAmount} {offer?.tag !== '' ? 'kk' : 'Wony'}
          </p>
          <p className="text-xs text-lightGray font-semibold">
            {(offer.pricePLN / offer.currencyAmount)
              .toFixed(2)
              .toString()
              .includes('.00')
              ? (offer.pricePLN / offer.currencyAmount).toFixed(0)
              : (offer.pricePLN / offer.currencyAmount).toFixed(2)}
            zł za 1kk
          </p>
        </div>
      </div>
      {/* <div className="flex gap-2 text-sm">
        {' '}
        <Image
          src={offer?.seller?.avatar}
          alt=""
          width={20}
          height={20}
          className="rounded-xl"
        />
        <p className="text-lightGray">{offer?.seller?.name}</p>
        <div className="">
          {offer.seller.verified ? (
            <p className="bg-darkGreen text-lightGreen font-medium px-1 rounded-md ">
              Verified
            </p>
          ) : (
            ''
          )}
        </div>
      </div> */}
    </div>
  );
}
