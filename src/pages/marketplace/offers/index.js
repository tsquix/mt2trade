import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import { fetchServerList } from '../../../../lib/fetchServers';
import ServerCard from '@/components/ServerCard';
import { useState } from 'react';

export default function OffersPage({ servers }) {
  const [expand, setExpand] = useState(false);
  return (
    //TODO wyszukiwarka
    <div className="">
      <Header />
      <div className="flex flex-col mx-auto max-w-7xl justify-center">
        <div className="pb-12 flex text-center justify-center">
          <h1 className="text-3xl">Wybierz swój serwer</h1>
        </div>
        <div className="grid grid-cols-3 gap-x-32 gap-y-24">
          {servers.slice(0, 6).map((server) => (
            <ServerCard key={server._id} server={server} />
          ))}
          {expand ? (
            servers
              .slice(6)
              .map((server) => <ServerCard key={server._id} server={server} />)
          ) : (
            <div className="col-span-3 flex justify-center items-center">
              <button
                onClick={() => setExpand(true)}
                className="bg-brighterBg hover:bg-white hover:text-black transition-colors px-8 pt-4 rounded-lg text-xl font-bold  border-mainBg border-solid border-2"
              >
                Show More Servers
                <div className="flex justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-10"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
export async function getStaticProps() {
  const baseUrl = process.env.NEXTAUTH_URL;
  const servers = await fetchServerList(baseUrl);
  return { props: { servers }, revalidate: 86400 };
}
