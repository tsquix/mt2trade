export default function OfferCardSkeleton() {
  return (
    <button
      className={`px-6 py-8 rounded-3xl animate-pulse bg-mainBg  hover:opacity-90`}
    >
      <div className="bg-mainBg p-6 rounded-3xl">
        <div className="flex mb-3">
          <div className="px-1 py-1 bg-brighterBg  w-16 rounded-3xl text-xs "></div>
        </div>
        <div className="px-1 mb-3 py-1 bg-brighterBg  w-32 rounded-3xl text-xs "></div>
        <div className="flex">
          <div className="">
            <div className="flex items-center mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="bg-mainBg"
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
              <div className="px-1 py-1 mx-2 bg-brighterBg w-8 rounded-3xl text-xs "></div>
            </div>
            <div className="px-1 py-1 bg-brighterBg w-64 rounded-3xl  "></div>
          </div>
        </div>
      </div>
    </button>
  );
}
