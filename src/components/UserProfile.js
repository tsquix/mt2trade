// UserProfile.jsx
import axios from 'axios';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import OfferCard from './OfferCard';
import OfferDetailPage from '@/pages/marketplace/offers/[server]/[offer]';
import Profile from './Profile';
// SWR fetcher function
const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch user data');
  return res.json();
};

export default function UserProfile({ sessionUser, otherUser }) {
  // Using SWR for data fetching with caching and revalidation
  const [offers, setOffers] = useState(null);
  const [view, setView] = useState('offers');
  const [status, setStatus] = useState('view');
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
    console.log(otherUser);
    // console.log(sessionUser);
  }, [otherUser]);
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
  useEffect(() => {
    if (userData?._id) {
      fetchOffers();
    }
  }, [userData]);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  if (isLoading) {
    return (
      <div className="bg-mainBg p-12  shadow-2xl animate-pulse">
        <div className="flex gap-16">
          <div className="w-[183px] h-[180px] bg-brighterBg rounded-lg"></div>
          <div className="grid grid-cols-2 w-full gap-4">
            <div className="h-8 bg-brighterBg rounded-2xl w-40"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-mainBg p-12 shadow-2xl">
        <p className="text-red-500">
          Error loading user profile: {error.message}
        </p>
      </div>
    );
  }

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
        {!otherUser && (
          <button
            className={`bg-mainBg px-2 py-1 ${view === 'offers' ? 'bg-red-300' : ''}`}
            onClick={() => setView('offers')}
          >
            my offers
          </button>
        )}
      </div>
      {view === 'profile' ? (
        <Profile userData={userData} />
      ) : (
        <div className="bg-mainBg p-12 shadow-2xl">
          <div className="flex mb-4 gap-2 group relative">
            {offers?.map((offer) => (
              <OfferCard
                key={offer._id}
                offer={offer}
                isSelected={selectedOffer?._id === offer._id}
                onClick={
                  status === 'view' ? () => setSelectedOffer(offer) : null
                }
                status={status}
                mode={'profile'}

                // isLoading={isLoading}
              />
            ))}
            {status === 'edit' && (
              <div
                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 
                  opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto
                  bg-gray-800 text-white text-xs rounded px-2 py-1 z-10 whitespace-nowrap 
                  transition-opacity duration-200"
              >
                Zakończ edycje by zobaczyć inne oferty
              </div>
            )}
          </div>
          <div className="sticky top-10 h-screen overflow-auto">
            <div className="flex bg-mainBg rounded-3xl">
              {selectedOffer && (
                <OfferDetailPage
                  offers={offers}
                  selectedOffer={selectedOffer}
                  setSelectedOffer={setSelectedOffer}
                  mode={'profile'}
                  status={status}
                  setStatus={setStatus}
                  fetchOffers={fetchOffers}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
