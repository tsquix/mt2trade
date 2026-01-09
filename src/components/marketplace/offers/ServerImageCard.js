import Image from 'next/image';
import Link from 'next/link';

export default function ({ serverData, server }) {
  return (
    <div className="relative w-full h-64 mb-8">
      <Image
        src={
          serverData?.img ||
          'https://forum.balmora.pl/uploads/monthly_2018_02/logovs.png.4ea36bb248bfd59a3d82251695ea07ad.png'
        }
        alt="Background"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="absolute inset-0 flex items-center justify-center text-white">
        <h1 className="text-3xl">{serverData?.name || server}</h1>
      </div>
      <div className="absolute top-0 p-4 rounded-full pointer ">
        <Link href={'/marketplace/offers'}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="size-6 hover:text-red-300 hover:opacity-80 transition-all"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
