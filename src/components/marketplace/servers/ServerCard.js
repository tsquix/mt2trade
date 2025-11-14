import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export default function ServerCard({ server }) {
  const offerCount = server.offerCount;
  const dcOfferCount = server.dcOfferCount;

  useEffect(() => {
    console.log(server);
  }, [server]);
  return (
    <Link
      key={server._id}
      href={`/marketplace/offers/${server.slug}`}
      className="hover:opacity-80 transition-all h-[152px] w-[288px]  md:h-[172px] md:w-[308px] relative block"
    >
      <Image
        src={server.img}
        fill
        alt={server.name}
        className="rounded-lg object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4 rounded-lg justify-between">
        <h3 className="text-white font-bold text-xl">{server.name}</h3>
        <h3 className="bg-black opacity-80 px-2 py-1 rounded">
          <span
            className={`${offerCount > 0 || dcOfferCount > 0 ? 'text-green-400' : 'text-red-400'} font-bold text-sm`}
          >
            {offerCount + dcOfferCount}{' '}
            {offerCount === 1 || dcOfferCount === 1 ? 'oferta' : 'ofert'}
          </span>
        </h3>
      </div>
    </Link>
  );
}
