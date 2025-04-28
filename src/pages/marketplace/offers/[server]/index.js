import Layout from '@/pages/layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import OfferDetailPage from './[offer]';
import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';
import OfferCard from '@/components/OfferCard';

export default function OfferPage() {
  const router = useRouter();
  const { server } = router.query;
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [offers, setOffers] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);
  const listRef = useRef(null);
  const [actionType, setActionType] = useState(null);
  const [currencyCount, setCurrencyCount] = useState(1);
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

  // useEffect(() => {}, [offers]);

  const handleSort = (e) => {
    const option = e.target.value;
    const sorted = [...offers];
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
    }
    setOffers(sorted);
  };

  const handleBuy = (e) => {
    setActionType(e.target.value);
    console.log(selectedOffer);
  };
  const pricePerUnit = 200 / 100;
  return (
    <Layout>
      {/* Header section remains unchanged */}
      {actionType === 'buy' && (
        <div className="bg-mainBg p-6 flex relative flex-col">
          <h1>
            kupujesz od :
            <Link
              target="_blank"
              href={`/profile/${selectedOffer.seller.name}`}
            >
              {selectedOffer.seller.name}
            </Link>
          </h1>
          <div className="flex gap-6 w-1/2 mx-3 text-center items-center mb-8">
            <label htmlFor="" className="text-nowrap">
              ile siana {currencyCount}
            </label>
            <input
              type="range"
              min="1"
              max={selectedOffer.currencyAmount}
              value={currencyCount}
              onChange={(e) => setCurrencyCount(parseInt(e.target.value))}
              className="w-full "
            />
            <div className="text-nowrap">
              {(
                (currencyCount * selectedOffer.pricePLN) /
                selectedOffer.currencyAmount
              ).toFixed(2)}{' '}
              zł
            </div>
          </div>
          <div>
            <button className="bg-brighterBg px-4 py-2 text-lg rounded-lg text-red-300">
              kup tera
            </button>
          </div>
          <div className="absolute top-5 right-5">
            <button
              onClick={() => setActionType(null)}
              className="text-red-500 font-bold text-lg"
            >
              X
            </button>
          </div>
        </div>
      )}
      <div className={`${actionType === 'buy' ? 'opacity-20' : 'opacity-100'}`}>
        <div className="flex justify-center text-center mb-12 flex-col">
          <div className="mb-2">
            <div className="absolute bg-mainBg px-4 py-2 rounded-full hover:opacity-70 pointer">
              <Link href={'/marketplace/offers'}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
                  />
                </svg>
              </Link>
            </div>
            <h1 className="text-3xl font-bold">{server}</h1>
          </div>
          <div className="flex justify-center mb-4">
            <Link href={`/marketplace/offers/create?server=${server}`}>
              <p className="text-3xl font-bold bg-mainBg hover:bg-white hover:text-black px-3 py-1 rounded-lg">
                Utworz swoja oferte
              </p>
            </Link>
          </div>
          <div>
            <h3>sortuj</h3>
            <select onChange={handleSort} className="text-black">
              <option value=""></option>
              <option value="yangAsc">Ilosc yang ASC</option>
              <option value="yangDesc">Ilosc yang DESC</option>
              <option value="priceAsc">Najtaniej</option>
              <option value="priceDesc">Najdrozej</option>
              <option value="rating">UserRating</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-16">
          <div className="flex flex-col gap-y-8 max-h-screen pr-4">
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
                <OfferCard offer={''} isLoading={true} />
              </>
            )}
            {offers?.length === 0 && (
              <div>
                <h2>Nie znaleźliśmy żadnej oferty dla tego serwera...</h2>
                <p>Bądź pierwszy i utwórz swoją ofertę już teraz!</p>
              </div>
            )}
          </div>

          {/* Right side remains unchanged */}
          <div className="sticky top-10 h-screen overflow-auto">
            <div className="flex bg-mainBg rounded-3xl">
              {selectedOffer && (
                <OfferDetailPage
                  offers={offers}
                  selectedOffer={selectedOffer}
                  handleBuy={handleBuy}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
