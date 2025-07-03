import Layout from '@/pages/layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import OfferDetailPage from './[offer]';
import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import OfferCard from '@/components/OfferCard';
import BuyOrder from '@/components/BuyOrder';
import Image from 'next/image';
import FilterAndSearch from '@/components/FilterAndSearch';

export default function OfferPage() {
  const router = useRouter();
  const { server } = router.query;
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [offers, setOffers] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(3);
  const listRef = useRef(null);
  const [actionType, setActionType] = useState(null);

  // Function to load more items
  const loadMore = useCallback(() => {
    if (offers && visibleCount < offers.length) {
      setVisibleCount((prev) => Math.min(prev + 3, offers.length));
    }
  }, [offers, visibleCount]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = listRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [loadMore]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/offer?server=${server}`);
        setOffers(response.data.offers);
        // Auto-select first offer if available
        if (response.data.offers && response.data.offers.length > 0) {
          setSelectedOffer(response.data.offers[0]);
        } else {
          setIsLoading(false);
        }
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

  // useEffect(() => {
  //   console.log(selectedOffer);
  // }, [selectedOffer]);

  const handleSort = (e) => {
    const option = e.target.value;
    const sorted = [...offers];
    if (currencyAmount) {
      switch (option) {
        case 'yangAsc': {
          sorted.sort((a, b) => a.currencyAmount - b.currencyAmount);
          break;
        }
        case 'yangDesc': {
          sorted.sort((a, b) => b.currencyAmount - a.currencyAmount);
          break;
        }
        case 'priceAsc': {
          sorted.sort(
            (a, b) =>
              a.pricePLN / a.currencyAmount - b.pricePLN / b.currencyAmount
          );
          break;
        }
        case 'priceDesc': {
          sorted.sort(
            (a, b) =>
              b.pricePLN / b.currencyAmount - a.pricePLN / a.currencyAmount
          );
          break;
        }
        case 'rating': {
          sorted.sort((a, b) => b.seller.userRating - a.seller.userRating);
          break;
        }
        case 'updatedAtDesc': {
          sorted.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
          break;
        }
        case 'updatedAtAsc': {
          sorted.sort(
            (a, b) =>
              new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          );
          break;
        }
      }
    }
    setOffers(sorted);
  };

  const handleBuy = (e) => {
    setActionType(e.target.value);
  };
  return (
    <Layout>
      {actionType === 'buy' && (
        <BuyOrder
          selectedOffer={selectedOffer}
          handleBuy={handleBuy}
          setActionType={setActionType}
        />
      )}
      <div className="bg-mainBg">
        <div
          className={`${actionType === 'buy' ? 'opacity-20' : 'opacity-100 '}`}
        >
          <div class="relative w-full h-64 mb-8 bg-mainBg">
            <Image
              src="https://forum.balmora.pl/uploads/monthly_2018_02/logovs.png.4ea36bb248bfd59a3d82251695ea07ad.png"
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            <div class="absolute inset-0 bg-black bg-opacity-50"></div>
            <div class="absolute inset-0 flex items-center justify-center text-white">
              <h1 class="text-3xl">{server}</h1>
            </div>
            <div className="absolute top-0 p-4 rounded-full pointer ">
              <Link href={'/marketplace/offers'}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6 hover:text-red-300 hover:opacity-80 transition-all"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
              </Link>
            </div>
          </div>

          <div className="flex lg:justify-between flex-col lg:flex-row mb-8 lg:mb-12 z-10">
            <div>
              <h2 className="font-bold text-xl">Yang Marketplace</h2>
              <p className="text-gray-300 mb-4 lg:mb-0">
                Przeglądaj i kupuj yangi od zaufanych handlarzy
              </p>
            </div>
            <div className="flex mb-4">
              <Link href={`/marketplace/offers/create?server=${server}`}>
                <p className="bg-red-300 hover:bg-red-400 text-white py-2 px-4 rounded-lg transition-colors duration-200">
                  + Utworz nową oferte
                </p>
              </Link>
            </div>
          </div>
          <div>
            <div className="grid grid-rows-2 lg:grid-cols-[0.7fr_1.3fr] gap-4">
              <div className="flex flex-col gap-y-4 lg:pr-4">
                {!isLoading ? (
                  <FilterAndSearch
                    handleSort={handleSort}
                    isLoading={isLoading}
                  />
                ) : (
                  <FilterAndSearch handleSort={handleSort} isLoading={true} />
                )}

                {!isLoading ? (
                  <>
                    {offers?.slice(0, visibleCount).map((offer) => (
                      <OfferCard
                        key={offer._id}
                        offer={offer}
                        isSelected={selectedOffer?._id === offer._id}
                        onClick={() => setSelectedOffer(offer)}
                        isLoading={isLoading}
                      />
                    ))}

                    {/* Load more trigger element */}
                    {offers && visibleCount < offers.length && (
                      <div ref={listRef} className="py-4 text-center">
                        <OfferCard offer={''} isLoading={true} />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <OfferCard offer={''} isLoading={true} />
                    <OfferCard offer={''} isLoading={true} />
                  </>
                )}
                {offers?.length === 0 && (
                  <div>
                    <h2>Nie znaleźliśmy żadnej oferty dla tego serwera...</h2>
                    <p className="mb-1">
                      Bądź pierwszy i
                      <Link
                        href={`/marketplace/offers/create?server=${server}`}
                        className="text-red-300 hover:text-red-400"
                      >
                        {' '}
                        utwórz teraz
                      </Link>{' '}
                    </p>
                  </div>
                )}
              </div>

              <div className="sticky -top-7 self-start h-fit ">
                <div className="flex bg-mainBg rounded-3xl">
                  {!isLoading && selectedOffer ? (
                    <OfferDetailPage
                      offers={offers}
                      selectedOffer={selectedOffer}
                      handleBuy={handleBuy}
                      isLoading={isLoading}
                    />
                  ) : (
                    <OfferDetailPage
                      offers={offers}
                      selectedOffer={selectedOffer}
                      handleBuy={handleBuy}
                      isLoading={isLoading}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
