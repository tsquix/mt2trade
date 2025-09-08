import Layout from '@/pages/layout';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import OfferCard from '@/components/OfferCard';
import BuyOrder from '@/components/BuyOrder';
import Image from 'next/image';
import FilterAndSearch from '@/components/FilterAndSearch';
import { useOrders } from '@/contexts/OrdersContext';
import OfferDetailPage from '@/components/OfferDetailPage';
import axios from 'axios';

export const getServerSideProps = async (context) => {
  const { server } = context.params;
  const res = await axios.get(
    `${process.env.BASE_URL}/api/offer?server=${server}`
  );
  const serverOffers = res.data.offers;
  return { props: { serverOffers } };
};

export default function OfferPage({ serverOffers }) {
  const { state, dispatch } = useOrders();
  const { isLoading, selectedOffer } = state;
  const [phrase, setPhrase] = useState('');
  const [searchServer, setSearchServer] = useState([]);
  const [debouncedPhrase, setDebouncedPhrase] = useState('');
  const router = useRouter();
  const { server } = router.query;
  const [visibleCount, setVisibleCount] = useState(5);
  const listRef = useRef(null);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      //sync context jesti ssr
      if (serverOffers?.length && !state.serverOffers.length) {
        dispatch({ type: 'SET_SERVER_OFFERS', payload: serverOffers });
        dispatch({
          type: 'SET_SELECTED_OFFER',
          payload: serverOffers[0] || null,
        });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      //aktualizujemy oferty w przypadku przejscia na inny server bez reload strony
      if (server) {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
          const res = await axios.get(`/api/offer?server=${server}`);
          dispatch({ type: 'SET_SERVER_OFFERS', payload: res.data.offers });
          dispatch({
            type: 'SET_SELECTED_OFFER',
            payload: res.data.offers[0] || null,
          });
        } catch (err) {
          console.error(err);
          dispatch({ type: 'SET_SERVER_OFFERS', payload: [] });
          dispatch({ type: 'SET_SELECTED_OFFER', payload: null });
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };
    fetchOffers();
  }, [server, serverOffers, state.serverOffers.length, dispatch]);

  useEffect(() => {
    //set selected offer if url contain slug
    if (server && state.serverOffers?.length) {
      const found = state.serverOffers.find((o) => o.slug === server);

      if (found) {
        dispatch({ type: 'SET_SELECTED_OFFER', payload: found });
      }
    }
  }, [server, state.serverOffers, dispatch]);

  // Function to load more items
  const loadMore = useCallback(() => {
    if (state.serverOffers && visibleCount < state.serverOffers.length) {
      setVisibleCount((prev) => Math.min(prev + 3, state.serverOffers.length));
    }
  }, [state.serverOffers, visibleCount]);
  // observer for infinite scroll
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
  }, [loadMore, visibleCount, state.serverOffers?.length]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPhrase(phrase);
    }, 300);

    return () => clearTimeout(handler);
  }, [phrase]);
  const filteredOffers = useMemo(() => {
    if (!debouncedPhrase) return state.serverOffers || [];
    //wyszukiwarka z regex

    const cleanPhrase = debouncedPhrase.replace(/\s+/g, '');
    const regex = new RegExp(cleanPhrase, 'i');

    let res = state.serverOffers.filter(
      (o) =>
        regex.test(o.title.replace(/\s+/g, '')) ||
        regex.test(o.description.replace(/\s+/g, '')) ||
        regex.test(o.seller.name.replace(/\s+/g, ''))
    );
    //partial search if nothing found
    if (res.length === 0 && debouncedPhrase.length > 2) {
      const partial = debouncedPhrase.slice(0, 2).replace(/\s+/g, '');
      const regexPartial = new RegExp(partial, 'i');
      res = state.serverOffers.filter((o) =>
        regexPartial.test(o.title.replace(/\s+/g, ''))
      );
    }
    return res;
  }, [debouncedPhrase, state.serverOffers]);

  const handleSelect = (offer) => {
    //ustawiamy selected offer
    dispatch({ type: 'SET_SELECTED_OFFER', payload: offer });

    // aktualizujemy url z slug oferty
    router.push(
      {
        pathname: `/marketplace/offers/${server}`,
        query: { offer: offer.slug },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleSort = (e) => {
    const option = e.target.value;
    const sorted = [...serverOffers];

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
    dispatch({
      type: 'SET_SERVER_OFFERS',
      payload: sorted,
    });
  };

  const handleBuy = (e) => {
    setActionType(e.target.value);
  };

  return (
    <Layout>
      <div className="bg-mainBg">
        <div>
          <div className="relative w-full h-64 mb-8 bg-mainBg">
            <Image
              src="https://forum.balmora.pl/uploads/monthly_2018_02/logovs.png.4ea36bb248bfd59a3d82251695ea07ad.png"
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <h1 className="text-3xl">{server}</h1>
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
                {serverOffers?.length !== 0 && (
                  <FilterAndSearch
                    handleSort={handleSort}
                    setPhrase={setPhrase}
                    phrase={phrase}
                  />
                )}
                {!isLoading && (
                  <>
                    {phrase.length > 0
                      ? filteredOffers.map((offer) => (
                          <OfferCard
                            key={offer._id}
                            offer={offer}
                            isSelected={selectedOffer?._id === offer._id}
                            onClick={() => handleSelect(offer)}
                          />
                        ))
                      : state.serverOffers
                          ?.slice(0, visibleCount)
                          .map((offer) => (
                            <OfferCard
                              key={offer._id}
                              offer={offer}
                              isSelected={selectedOffer?._id === offer._id}
                              onClick={() => handleSelect(offer)}
                            />
                          ))}

                    {/* Load more trigger element */}
                    {serverOffers && visibleCount < serverOffers.length && (
                      <div
                        ref={listRef}
                        className="py-4 text-center text-gray-400"
                      >
                        Ładowanie więcej...
                      </div>
                    )}
                  </>
                )}
                {/* // : ( //{' '}
                <>
                  // <OfferCard offer={''} />
                  // <OfferCard offer={''} />
                  //{' '}
                </>
                // )} */}
                {serverOffers?.length === 0 && (
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

              <div className="sticky -top-7 self-start h-fit  ">
                <div className="absolute w-full z-20">
                  {actionType === 'buy' && (
                    <BuyOrder
                      setActionType={setActionType}
                      actionType={actionType}
                    />
                  )}
                </div>
                <div
                  className={`flex bg-mainBg rounded-3xl ${actionType === 'buy' ? 'opacity-20' : 'opacity-100 '}`}
                  // className={``}
                >
                  {!isLoading &&
                    selectedOffer &&
                    serverOffers?.length !== 0 && (
                      <OfferDetailPage handleBuy={handleBuy} />
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
