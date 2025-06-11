// UserProfile.jsx
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import OfferCard from './OfferCard';
import OfferDetailPage from '@/pages/marketplace/offers/[server]/[offer]';
// SWR fetcher function
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch user data');
  return res.json();
};

export default function UserProfile({ sessionUser }) {
  // Using SWR for data fetching with caching and revalidation
  const [offers, setOffers] = useState(null);
  const [view, setView] = useState('profile');
  const [selectedOffer, setSelectedOffer] = useState(null);

  const { data, error, isLoading } = useSWR(
    sessionUser?.name ? `/api/user/${sessionUser.name}` : null,
    fetcher,
    {
      revalidateOnFocus: false, // Don't refetch when window regains focus
      revalidateOnReconnect: true, // Refetch when reconnecting
      dedupingInterval: 60000, // Dedupe requests within 1 minute
    }
  );

  const userData = data?.user;

  useEffect(() => {
    console.log(sessionUser);
  }, [sessionUser]);
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        // setIsLoading(true);
        const response = await axios.get(`/api/offer?userId=${userData._id}`);
        setOffers(response.data.offers);
        if (response.data.offers && response.data.offers.length > 0) {
        }
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        // setIsLoading(false);
      }
    };
    if (userData?._id) {
      fetchOffers();
    }
  }, [userData]);

  useEffect(() => {
    console.log(userData);
  }, [userData]);
  // Handle loading state
  if (isLoading) {
    return (
      <div className="bg-mainBg p-12 shadow-2xl animate-pulse">
        <div className="flex gap-16">
          <div className="w-[183px] h-[180px] bg-brighterBg rounded-lg"></div>
          <div className="grid grid-cols-2 w-full gap-4">
            <div className="h-8 bg-brighterBg rounded-2xl w-40"></div>
            {/* Other skeleton loaders */}
          </div>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="bg-mainBg p-12 shadow-2xl">
        <p className="text-red-500">
          Error loading user profile: {error.message}
        </p>
      </div>
    );
  }

  // If no data yet
  if (!userData) {
    return null;
  }

  return (
    <>
      <div>
        <button
          className={`bg-mainBg px-2 py-1 ${view === 'profile' ? 'bg-red-300' : ''}`}
          onClick={() => setView('profile')}
        >
          profil
        </button>
        <button
          className={`bg-mainBg px-2 py-1 ${view === 'offers' ? 'bg-red-300' : ''}`}
          onClick={() => setView('offers')}
        >
          offers
        </button>
      </div>
      {view === 'profile' ? (
        <div className="bg-mainBg p-12 shadow-2xl mb-12">
          <div className="flex gap-16">
            <div className="">
              {' '}
              <Image
                src={
                  'https://cdn.tipo.live/files/avatar/48968_avatar.jpg?id=fa2f0c061cfb9c5000b18d2561baf330'
                }
                width={232}
                height={232}
                className="p-4 bg-brighterBg rounded-lg"
              />
            </div>
            <div className="grid grid-cols-2 w-full">
              <div className="">
                <div className="mb-2">
                  <span className="text-3xl bg-brighterBg text-red-300 px-4 py-1 rounded-2xl  text-center">
                    {userData?.name}
                  </span>
                </div>
                {userData?.verified && (
                  <p className="flex gap-2 mb-4">
                    certified
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="#fca5a5"
                      class="size-6 "
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z"
                      />
                    </svg>
                  </p>
                )}
                {userData?.verified !== true && (
                  <p className="flex gap-2 mb-4">
                    non certified
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke-width="1.5"
                      stroke="#fca5a5"
                      class="size-6"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </p>
                )}

                <div className="flex gap-2 flex-col">
                  Kontakt
                  <div className="flex gap-2">
                    <svg
                      width="24px"
                      height="24px"
                      viewBox="0 0 24 24"
                      fill="white"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M18.8943 4.34399C17.5183 3.71467 16.057 3.256 14.5317 3C14.3396 3.33067 14.1263 3.77866 13.977 4.13067C12.3546 3.89599 10.7439 3.89599 9.14391 4.13067C8.99457 3.77866 8.77056 3.33067 8.58922 3C7.05325 3.256 5.59191 3.71467 4.22552 4.34399C1.46286 8.41865 0.716188 12.3973 1.08952 16.3226C2.92418 17.6559 4.69486 18.4666 6.4346 19C6.86126 18.424 7.24527 17.8053 7.57594 17.1546C6.9466 16.92 6.34927 16.632 5.77327 16.2906C5.9226 16.184 6.07194 16.0667 6.21061 15.9493C9.68793 17.5387 13.4543 17.5387 16.889 15.9493C17.0383 16.0667 17.177 16.184 17.3263 16.2906C16.7503 16.632 16.153 16.92 15.5236 17.1546C15.8543 17.8053 16.2383 18.424 16.665 19C18.4036 18.4666 20.185 17.6559 22.01 16.3226C22.4687 11.7787 21.2836 7.83202 18.8943 4.34399ZM8.05593 13.9013C7.01058 13.9013 6.15725 12.952 6.15725 11.7893C6.15725 10.6267 6.98925 9.67731 8.05593 9.67731C9.11191 9.67731 9.97588 10.6267 9.95454 11.7893C9.95454 12.952 9.11191 13.9013 8.05593 13.9013ZM15.065 13.9013C14.0196 13.9013 13.1652 12.952 13.1652 11.7893C13.1652 10.6267 13.9983 9.67731 15.065 9.67731C16.121 9.67731 16.985 10.6267 16.9636 11.7893C16.9636 12.952 16.1317 13.9013 15.065 13.9013Z"
                        stroke="#000000"
                        stroke-linejoin="round"
                      />
                    </svg>
                    <span>tsquix#3300</span>
                  </div>
                </div>
              </div>
              <div>
                {' '}
                <div className="mb-2 flex items-center gap-4">
                  <h2> Ilość transakcji</h2>
                  <span className="text-xl bg-brighterBg text-red-300 px-4 py-1 rounded-2xl  text-center">
                    {userData?.transactionCount}
                  </span>
                </div>
                <div className="mb-2 flex items-center gap-4">
                  <h2> User rating</h2>
                  <span className="text-xl bg-brighterBg text-red-300 px-4 py-1 rounded-2xl  text-center">
                    {userData?.userRating}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-mainBg p-12 shadow-2xl">
          <div className="flex">
            {offers?.map((offer) => (
              <OfferCard
                key={offer._id}
                offer={offer}
                isSelected={selectedOffer?._id === offer._id}
                onClick={() => setSelectedOffer(offer)}
                // isLoading={isLoading}
              />
            ))}
          </div>
          <div className="sticky top-10 h-screen overflow-auto">
            <div className="flex bg-mainBg rounded-3xl">
              {selectedOffer && (
                <OfferDetailPage
                  offers={offers}
                  selectedOffer={selectedOffer}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
