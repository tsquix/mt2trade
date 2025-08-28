import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import { fetchServerList } from '../../../../lib/fetchServers';
import ServerCard from '@/components/ServerCard';
import { useState } from 'react';
import { getAllOffersCount } from '../../../../lib/offers';

export default function OffersPage({ servers, debug, error }) {
  const [expand, setExpand] = useState(false);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <h1 className="text-2xl font-bold mb-4">Błąd ładowania</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <Header />
      <div className="flex flex-col mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 justify-center items-center">
        <div className="pb-8 flex text-center justify-center items-center gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Wybierz swój serwer
          </h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-10  lg:gap-12 xl:gap-24">
          {servers.slice(0, 6).map((server) => (
            <ServerCard key={server._id} server={server} />
          ))}

          {expand ? (
            servers
              .slice(6)
              .map((server) => <ServerCard key={server._id} server={server} />)
          ) : servers.length > 6 ? (
            <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center">
              <button
                onClick={() => setExpand(true)}
                className="flex flex-col items-center bg-brighterBg hover:bg-white hover:text-black transition-colors px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-lg sm:text-xl font-bold border-mainBg border-2"
              >
                Show More Servers
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-8 h-8 mt-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://mt2trade.vercel.app';

    const [servers, offerCounts] = await Promise.all([
      fetchServerList(baseUrl),
      getAllOffersCount(),
    ]);

    const serversWithOffers = servers.map((server) => ({
      ...server,
      offerCount: offerCounts[server.name] || 0,
    }));

    return {
      props: {
        servers: serversWithOffers,
      },
      revalidate: 14400,
    };
  } catch (error) {}
}
