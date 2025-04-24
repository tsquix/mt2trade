import Layout from '@/pages/layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import OfferDetailPage from './[offer]';
import { useEffect, useState } from 'react';
import axios from 'axios';
import OfferCard from '@/components/OfferCard';

export default function OfferPage() {
  const router = useRouter();
  const { server } = router.query;
  const [selectedOffer, setSelectedOffer] = useState(null); // State for selected offer
  const [offers, setOffers] = useState(null); // State for selected offer
  const [isLoading, setIsLoading] = useState(false); // State for selected offer
  useEffect(() => {
    console.log(offers);
  }, [offers]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/offer?server=${server}`);
        setOffers(response.data.offers);
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (server) {
      fetchOffers();
    }
  }, [server]);

  return (
    <Layout>
      <div className="flex justify-center text-center mb-12 flex-col">
        <div className="mb-2">
          <div className="absolute bg-mainBg px-4 py-2 rounded-full hover:opacity-70 pointer">
            <Link href={'/marketplace/offers'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                />
              </svg>
            </Link>
          </div>
          <h1 className="text-3xl font-bold">{server}</h1>
        </div>
        <div className="flex justify-center">
          <Link href={`/marketplace/offers/create?server=${server}`}>
            <p className="text-3xl font-bold bg-mainBg hover:bg-white hover:text-black px-3 py-1 rounded-lg">
              Utworz swoja oferte
            </p>
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-16">
        <div className="flex flex-col gap-y-8 ">
          {' '}
          {!isLoading ? (
            offers
              ?.slice(0, 3)
              .map((offer) => (
                <OfferCard
                  key={offer._id}
                  offer={offer}
                  isSelected={selectedOffer?._id === offer._id}
                  onClick={() => setSelectedOffer(offer)}
                  isLoading={isLoading}
                />
              ))
          ) : (
            <>
              <OfferCard offer={''} />
              <OfferCard offer={''} />
              <OfferCard offer={''} />
            </>
          )}
          {offers?.length === 0 && (
            <div>
              {' '}
              <h2>Nie znaleźliśmy żadnej oferty dla tego serwera...</h2>
              <p>Bądź pierwszy i utwórz swoją ofertę już teraz!</p>
            </div>
          )}
        </div>
        <div className="sticky top-10 h-screen overflow-auto">
          {' '}
          {/* Ensure the parent has a height and overflow */}
          <div className="flex bg-mainBg  rounded-3xl">
            {selectedOffer && (
              <OfferDetailPage offers={offers} selectedOffer={selectedOffer} />
            )}{' '}
            {/* Pass selected offer */}
          </div>
        </div>
      </div>
    </Layout>
  );
}
