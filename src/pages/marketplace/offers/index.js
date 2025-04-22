import Header from '@/components/Header';
import Image from 'next/image';
import Link from 'next/link';
import { fetchServerList } from '../../../../lib/fetchServers';

export default function OffersPage({ servers }) {
  return (
    //TODO wyszukiwarka
    <div className="">
      <Header />
      <div className="flex flex-col mx-auto max-w-7xl justify-center">
        <div className="pb-12 flex text-center justify-center">
          <h1 className="text-3xl">Wybierz swój serwer</h1>
        </div>
        <div className="grid grid-cols-3 gap-x-32 gap-y-24">
          {servers.map((server) => (
            <Link
              key={server.slug}
              href={`/marketplace/offers/${server.slug}`} // Link to the server page
              className="hover:opacity-80 transition-all h-[172px] w-[308px] relative block"
            >
              <Image
                src={server.img}
                fill
                alt={server.name}
                className="rounded-lg"
              />
            </Link>
          ))}
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
