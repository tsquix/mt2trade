import Image from 'next/image';

export default function UserDisplay({
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
        className={`flex gap-2 text-sm items-center  ${smaller ? '  ' : ' mb-4'}`}
      >
        <Image
          src={offer?.seller?.avatar}
          alt=""
          width={width}
          height={height}
          className={`${classNameImg} rounded-full`}
        />
        <div className="flex-col">
          <div className="flex gap-2">
            <h3 className="font-medium text-white">{offer?.seller?.name}</h3>
            {offer?.seller?.verified && (
              <p
                className={` bg-green-900 text-green-400 text-xs py-0.5 ${smaller ? 'rounded  px-1.5  ' : ' px-2 rounded-full'}`}
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
      {!smaller && (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-mainBg rounded-lg p-3">
            <div className="text-xl font-bold text-white">
              {offer?.seller?.transactionCount}
            </div>
            <div className="text-xs text-gray-400">Completed Sales</div>
          </div>
          <div className="bg-mainBg rounded-lg p-3">
            <div className="text-xl font-bold text-white">98%</div>
            <div className="text-xs text-gray-400">Positive Feedback</div>
          </div>
          <div className="bg-mainBg rounded-lg p-3">
            <div className="text-xl font-bold text-green-400">15 min</div>
            <div className="text-xs text-gray-400">Avg. Response Time</div>
          </div>
        </div>
      )}
    </>
  );
}
