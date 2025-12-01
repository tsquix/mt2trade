import Header from '@/components/layout/Header';
import Image from 'next/image';
import Link from 'next/link';
import { fetchServerList } from '../../../../lib/fetchServers';
import ServerCard from '@/components/marketplace/servers/ServerCard';
import { useEffect, useMemo, useState } from 'react';
import { getAllDcOffersCount, getAllOffersCount } from '../../../../lib/offers';
import { useFilterByRegex } from '../../../../hooks/useFilterByRegex';

export default function OffersPage({ servers, uncategorizedCount, debug, error }) {
  const [expand, setExpand] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [debouncedPhrase, setDebouncedPhrase] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPhrase(phrase);
    }, 300);

    return () => clearTimeout(handler);
  }, [phrase]);
  useEffect(() => {
    console.log(servers);
  }, [servers]);

  const filteredOffers = useFilterByRegex(debouncedPhrase, servers, [
    'name',
    'slug',
  ]);

  const displayedOffers = expand ? filteredOffers : filteredOffers.slice(0, 6);

  const shouldShowExpandButton = filteredOffers.length > 6 && !expand;

  // Create uncategorized server object
  const uncategorizedServer = {
    _id: 'uncategorized',
    name: 'Uncategorized',
    slug: 'uncategorized',
    img: '/images/uncategorized.jpg',
    offerCount: 0,
    dcOfferCount: uncategorizedCount,
    totalOffers: uncategorizedCount,
  };
  // useEffect(() => {
  //   console.log(filteredOffers);
  // }, [filteredOffers]);
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
      <div className="flex flex-col mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 justify-center items-center my-4">
        <div className="pb-8 flex flex-col text-center justify-center items-center select-none ">
          <h1 className="text-2xl sm:text-3xl font-bold ">
            Wybierz swój serwer
          </h1>
          <p className="text-xs text-gray-300">lub</p>
          <div className=" flex flex-col">
            <div className="">
              <label className="block text-sm text-gray-400 mb-1">
                Wyszukaj
              </label>
            </div>

            <input
              type="text"
              value={phrase}
              onChange={(e) => setPhrase(e.target.value)}
              placeholder="Tundria..."
              className="w-full bg-mainBg border border-gray-700 rounded-lg py-2 px-3 text-sm"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 sm:gap-10  lg:gap-12 xl:gap-24">
          {displayedOffers.map((server) => (
            <ServerCard key={server._id} server={server} />
          ))}
          {uncategorizedCount > 0 && (
            <ServerCard key="uncategorized" server={uncategorizedServer} />
          )}
          {shouldShowExpandButton && (
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
          )}
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://mt2trade.vercel.app';

    const [servers, offerCounts, dcOfferCounts] = await Promise.all([
      fetchServerList(baseUrl),
      getAllOffersCount(),
      getAllDcOffersCount(),
    ]);

    const serversWithOffers = servers
      .map((server) => ({
        ...server,
        offerCount: offerCounts[server.slug] || 0,
        dcOfferCount: dcOfferCounts[server.slug] || 0,
        totalOffers:
          (offerCounts[server.slug] || 0) + (dcOfferCounts[server.slug] || 0),
      }))
      .sort((a, b) => b.totalOffers - a.totalOffers);

    // Add uncategorized server with dcOffers count
    const uncategorizedCount = dcOfferCounts['uncategorized'] || 0;

    return {
      props: {
        servers: serversWithOffers,
        uncategorizedCount,
      },
      revalidate: 14400,
    };
  } catch (error) {}
}
