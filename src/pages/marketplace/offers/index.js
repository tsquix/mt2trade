import Header from '@/components/layout/Header';
import Image from 'next/image';
import Link from 'next/link';
import { fetchServerList } from '../../../../lib/fetchServers';
import ServerCard from '@/components/marketplace/servers/ServerCard';
import { useEffect, useMemo, useState } from 'react';
import { getAllOffersCount } from '../../../../lib/offers';
import { useFilterByRegex } from '../../../../hooks/useFilterByRegex';

export default function OffersPage({ servers, debug, error }) {
  const [expand, setExpand] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [debouncedPhrase, setDebouncedPhrase] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPhrase(phrase);
    }, 300);

    return () => clearTimeout(handler);
  }, [phrase]);

  const filteredOffers = useFilterByRegex(debouncedPhrase, servers, [
    'name',
    'slug',
  ]);
  // const filteredOffers = function (debouncedPhrase) {

  //   return useMemo(() => {
  //     if (!debouncedPhrase) return servers || [];
  //     //wyszukiwarka z regex
  //     const cleanPhrase = debouncedPhrase.replace(/\s+/g, '');
  //     const regex = new RegExp(cleanPhrase, 'i');

  //     let res = servers.filter(
  //       (s) =>
  //         regex.test(s.name.replace(/\s+/g, '')) ||
  //         regex.test(s.slug.replace(/\s+/g, ''))
  //     );
  //     //partial search if nothing found
  //     if (res.length === 0 && debouncedPhrase.length > 1) {
  //       const partial = debouncedPhrase.slice(0, 1).replace(/\s+/g, '');
  //       const regexPartial = new RegExp(partial, 'i');
  //       res = servers.filter((o) =>
  //         regexPartial.test(o.name.replace(/\s+/g, ''))
  //       );
  //     }
  //     return res;
  //   }, [debouncedPhrase, servers]);
  // };
  const displayedOffers = expand ? filteredOffers : filteredOffers.slice(0, 3);

  const shouldShowExpandButton = filteredOffers.length > 3 && !expand;
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
