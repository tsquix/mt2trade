import { Rating } from 'react-simple-star-rating';
import { useEffect } from 'react';

export default function TitleRating({
  offer,
  displayRatingNumber,
  className,
  smaller,
}) {
  useEffect(() => {
    console.log(offer?.seller?.userRating);
  }, [offer]);
  if (!offer || !offer.seller) return null;
  return (
    <div className={className}>
      <div className="flex justify-between">
        <div className="bg-brighterBg ">
          <div className={`${smaller ? '' : 'text-2xl'}`}>
            <strong>
              {offer?.title ? offer?.title : '50M Yang - Fast Delivery'}
            </strong>
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
                      initialValue={offer?.seller?.userRating || 0}
                      allowFraction
                      size={17}
                      fillColor="#facc15"
                      emptyColor="#e5e7eb"
                    />
                  </div>
                  {displayRatingNumber && (
                    <p className="text-xs text-white">
                      {offer?.seller?.userRating.toString().length <= 1
                        ? offer?.seller?.userRating.toString() + '.0'
                        : offer?.seller?.userRating}
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
            {offer?.currencyAmount} {offer?.tag !== '' ? 'kk' : 'Wony'}
          </p>
          <p className="text-xs text-lightGray font-semibold">
            {(offer?.pricePLN / offer?.currencyAmount)
              .toFixed(2)
              .toString()
              .includes('.00')
              ? (offer?.pricePLN / offer?.currencyAmount).toFixed(0)
              : (offer?.pricePLN / offer?.currencyAmount).toFixed(2)}
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
