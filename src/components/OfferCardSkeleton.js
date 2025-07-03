import { Rating } from 'react-simple-star-rating';

export default function OfferCardSkeleton() {
  return (
    <button
      className={`px-2 py-6 rounded-lg animate-pulse border bg-mainBg  hover:opacity-90`}
    >
      <div className="bg-mainBg  rounded-3xl">
        <div className="justify-between flex">
          <div className="px-1 mb-3 py-1 bg-brighterBg  w-32 rounded-3xl text-xs "></div>
          <div className="flex mb-3">
            <div className="px-1 py-1 bg-brighterBg w-16 rounded-3xl text-xs "></div>
          </div>
        </div>
        <div className="flex">
          <div className="">
            <div className="flex items-center mb-2">
              <Rating
                readonly
                SVGclassName="inline"
                initialValue={4}
                allowFraction
                size={17}
                fillColor="#7e949d"
                emptyColor="#e5e7eb"
              />
              <div className="px-1 py-1 mx-2 bg-brighterBg w-8 rounded-3xl text-xs "></div>
            </div>
            <div className="px-1 py-1 bg-brighterBg w-64 rounded-3xl  "></div>
          </div>
        </div>
      </div>
    </button>
  );
}
