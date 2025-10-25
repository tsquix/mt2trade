import Image from 'next/image';
import Link from 'next/link';
import { memo } from 'react';

function UserDisplay({
  offer,
  width = 20,
  height = 20,
  classNameImg,
  smaller,
}) {
  const createdAt = offer.seller.createdAt;
  const date = new Date(createdAt);
  const monthYear = date.toLocaleDateString('pl-PL', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <>
      <div
        className={`flex gap-2 text-sm items-center  justify-between ${smaller ? '' : 'mb-4'}`}
      >
        <div className="flex gap-2 ">
          <Image
            src={offer?.seller?.avatar.url ?? offer?.seller?.avatar}
            alt=""
            width={width}
            height={height}
            className={`${classNameImg} rounded-full`}
          />

          <div className="flex-col">
            <div className="flex gap-2 items-center">
              {!smaller ? (
                <Link href={`/profile/${offer?.seller?.name}`}>
                  {offer?.seller?.name}
                </Link>
              ) : (
                <p className={`font-sm ${smaller ? 'text-gray-400' : ''}`}>
                  {offer?.seller?.name}
                </p>
              )}

              {offer?.seller?.verified && (
                <p
                  className={` bg-green-900 text-green-400 px-1.5 py-0.5 rounded text-xs`}
                >
                  {smaller ? 'Verified' : 'Verified Seller'}
                </p>
              )}
            </div>
            {!smaller && (
              <p className="text-sm text-gray-400">Użytkownik od {monthYear}</p>
            )}
          </div>
        </div>
        {smaller && offer?.messages?.length > 0 && (
          <div className="flex gap-2">
            {/* //TODO ADD real count  */}
            {offer?.messages?.length}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-5 text-red-300"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155"
              />
            </svg>
          </div>
        )}
      </div>
      {!smaller && (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-mainBg rounded-lg p-3">
            <div className="sm:text-xl text-lg font-bold text-white">
              {offer?.seller?.transactionCount}
            </div>
            <div className="text-xs text-gray-400">Completed Sales</div>
          </div>
          <div className="bg-mainBg rounded-lg p-3">
            <div className="sm:text-xl text-lg font-bold text-white">98%</div>
            <div className="text-xs text-gray-400">Positive Feedback</div>
          </div>
          <div className="bg-mainBg rounded-lg p-3">
            <div className="sm:text-xl text-lg font-bold text-green-400">
              15 min
            </div>
            <div className="text-xs text-gray-400">Avg. Response Time</div>
          </div>
        </div>
      )}
    </>
  );
}
export default memo(UserDisplay);
