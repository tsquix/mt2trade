import Link from 'next/link';
import { memo, useEffect } from 'react';
import OfferCardSkeleton from './OfferCardSkeleton';
// Add onClick and isSelected props
function OfferCard({ offer, onClick, isSelected, isLoading }) {
  useEffect(() => {
    console.log(offer);
  }, [offer]);
  if (!offer || isLoading) {
    return <OfferCardSkeleton />;
  }

  return (
    <button
      className={`p-6 rounded-3xl block transition-all w-full text-left  ${
        isSelected
          ? 'opacity-50 bg-brighterBg p-0'
          : 'bg-mainBg  hover:opacity-90'
      }`}
      onClick={onClick}
    >
      <div className="bg-mainBg p-6 rounded-3xl">
        <div className="flex gap-2 mb-3">
          <div className="px-1 py-1 bg-brighterBg text-center w-16 rounded-3xl text-xs ">
            {offer?.tag !== '' ? 'Yang' : 'Wony'}
          </div>
        </div>
        <div className="mb-3">
          <strong>{offer?.title}</strong>
        </div>
        <div className="flex">
          <div className="flex">
            <div className="text-sm font-bold ">
              <div className="flex items-center mb-2">
                {offer?.seller?.userRating} {/* Display userrating */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="red"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                  />
                </svg>
                <Link href={`/profile/${offer?.seller?.name}`}>
                  <span className="text-red-300 px-2">
                    {' '}
                    {offer?.seller?.name} {/* Display username */}
                  </span>
                </Link>
              </div>
              <span className="text-gray-300">{offer?.description}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
export default memo(OfferCard);
