import { useOrders } from '@/contexts/OrdersContext';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';

export default function ServerCard({ server }) {
  // const { state, actions } = useOrders();
  // const { serverOffers } = state;

  const offerCount = server.offerCount;

  // useEffect(() => {
  //   actions.fetchServerOffers(server.name);
  // }, []);

  // useEffect(() => {
  //   console.log(serverOffers);
  // }, [serverOffers]);
  // const offerCount = serverOffers.filter(
  //   (offer) => offer.serverName === server.name
  // ).length;
  return (
    <Link
      key={server._id}
      href={`/marketplace/offers/${server.slug}`}
      className="hover:opacity-80 transition-all h-[172px] w-[308px] relative block"
    >
      <Image
        src={server.img}
        fill
        alt={server.name}
        className="rounded-lg object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-30 flex items-end p-4 rounded-lg justify-between">
        <h3 className="text-white font-bold text-xl">{server.name}</h3>
        <h3 className=" bg-black opacity-80 px-1">
          <span
            className={`${offerCount > 0 ? 'text-green-400' : 'text-red-400'} e font-bold text-md`}
          >
            ilośc ofert {offerCount}
          </span>
        </h3>
      </div>
    </Link>
  );
}
