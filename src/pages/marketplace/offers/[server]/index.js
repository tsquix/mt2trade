import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef, useCallback, useMemo, memo } from 'react';
import BuyOrder from '@/components/orders/BuyOrder';

import FilterAndSearch from '@/components/ui/FilterAndSearch';
import { useOrders } from '@/contexts/OrdersContext';
import axios from 'axios';
import ViewSelect from '@/components/ui/ViewSelect';
import OfferCard from '@/components/marketplace/offers/OfferCard';
import OfferDetailPage from '@/components/marketplace/offers/OfferDetailPage';
import { useFilterByRegex } from '../../../../../hooks/useFilterByRegex';

import ServerImageCard from '@/components/marketplace/offers/ServerImageCard';

import MarketplaceTour from '@/components/marketplace/offers/MarketplaceTour';
export const getServerSideProps = async (context) => {
  const { server: serverSlug } = context.params;

  try {
    // Handle special "uncategorized" case
    if (serverSlug === 'uncategorized') {
      return {
        props: {
          serverOffers: [],
          serverData: {
            _id: 'uncategorized',
            name: 'Uncategorized',
            slug: 'uncategorized',
            img: '/images/uncategorized.jpg',
          },
        },
      };
    }

    // Pobierz oferty i dane serwera równolegle
    const [offersRes, serversRes] = await Promise.all([
      axios.get(`${process.env.BASE_URL}/api/offer?server=${serverSlug}`),
      axios.get(`${process.env.BASE_URL}/api/server`),
    ]);

    if (!offersRes.data || !offersRes.data.offers) {
      return {
        notFound: true,
      };
    }

    // Znajdź obiekt serwera na podstawie slug lub nameAlias
    const serverObject = serversRes.data.data.find(
      (s) =>
        s.slug === serverSlug ||
        s.name === serverSlug ||
        s.nameAlias?.includes(serverSlug)
    );

    if (!serverObject) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        serverOffers: offersRes.data.offers,
        serverData: serverObject, // Pełny obiekt serwera z img
      },
    };
  } catch (error) {
    console.error('Błąd pobierania danych:', error?.message);
    if (error?.response?.status === 404) {
      return {
        notFound: true,
      };
    }
    return {
      props: {
        serverOffers: [],
        serverData: null,
        error: true,
        errorMessage: error.message || 'Wystąpił nieoczekiwany błąd',
      },
    };
  }
};

export default function OfferPage({ serverOffers, serverData }) {
  const { state, dispatch } = useOrders();
  const { isLoading, selectedOffer } = state;
  const [phrase, setPhrase] = useState('');
  const [debouncedPhrase, setDebouncedPhrase] = useState('');
  const router = useRouter();
  const { server } = router.query;
  const [visibleCount, setVisibleCount] = useState(30);
  const listRef = useRef(null);
  const [actionType, setActionType] = useState(null);
  const [offersView, setOffersView] = useState('');
  const [discordThreads, setDiscordThreads] = useState([]);

  const currentOffers =
    offersView === 'oferty' ? state.serverOffers : discordThreads;

  useEffect(() => {
    const fetchExternalOffers = async () => {
      try {
        if (server) {
          const res = await axios.get(`/api/dcOffers?server=${server}`);

          const data = res.data.data;
          setDiscordThreads(data);

          data.length === 0
            ? setOffersView('oferty')
            : setOffersView('ofertydc');

          data.length > 0
            ? dispatch({
                type: 'SET_SELECTED_OFFER',
                payload: data[0] || null,
              })
            : '';
        }
      } catch (error) {
        console.error(error.message);
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchExternalOffers();
  }, []);

  useEffect(() => {
    const fetchOffers = async () => {
      //sync context jesti ssr
      if (serverOffers?.length && !state.serverOffers.length) {
        dispatch({ type: 'SET_SERVER_OFFERS', payload: serverOffers });
        // dispatch({
        //   type: 'SET_SELECTED_OFFER',
        //   payload: serverOffers[0] || null,
        // });
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }
      const isDataAlreadyLoaded =
        state.serverOffers.length > 0 &&
        state.serverOffers[0].serverSlug === server;

      if (isDataAlreadyLoaded) return;

      // pobranie clientside -aktualizujemy oferty w przypadku przejscia na inny server bez reload strony
      if (server) {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
          const res = await axios.get(`/api/offer?server=${server}`);
          dispatch({ type: 'SET_SERVER_OFFERS', payload: res.data.offers });

          currentOffers === 'oferty'
            ? dispatch({
                type: 'SET_SELECTED_OFFER',
                payload: res.data.offers[0] || null,
              })
            : null;
        } catch (err) {
          console.error(err);
          dispatch({ type: 'SET_SERVER_OFFERS', payload: [] });
          // dispatch({ type: 'SET_SELECTED_OFFER', payload: null });
        } finally {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    };
    fetchOffers();
  }, [server, serverOffers, state.serverOffers.length, dispatch]);

  useEffect(() => {
    //TODO fix offer url z dc offers
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
      { threshold: 0.3 }
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

  // Określamy pola do filtrowania w zależności od widoku
  const fieldsToFilter = useMemo(() => {
    if (offersView === 'oferty') {
      return ['title', 'description', 'seller.name'];
    } else {
      return ['seller.name', 'title', 'starterMessage'];
    }
  }, [offersView]);

  // Używamy hooka useFilterByRegex
  const filteredOffers = useFilterByRegex(
    debouncedPhrase,
    currentOffers,
    fieldsToFilter
  );

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

  useEffect(() => {
    // Automatycznie wybierz pierwszą ofertę gdy zmieniamy widok
    if (offersView === 'oferty' && state.serverOffers.length > 0) {
      dispatch({
        type: 'SET_SELECTED_OFFER',
        payload: state.serverOffers[0],
      });
    } else if (offersView === 'ofertydc' && discordThreads.length > 0) {
      dispatch({
        type: 'SET_SELECTED_OFFER',
        payload: discordThreads[0],
      });
    }
  }, [offersView]);
  return (
    <Layout>
      <MarketplaceTour setOffersView={setOffersView} />
      <div className="bg-mainBg">
        <div>
          <ServerImageCard serverData={serverData} server={server} />

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

          <ViewSelect
            view={offersView}
            setView={setOffersView}
            orders={false}
            offerCount={state.serverOffers.length}
            dcOfferCount={discordThreads.length}
          />

          <div>
            <div className="grid grid-rows-1 lg:grid-cols-[0.7fr_1.3fr] gap-4">
              <div className="flex flex-col gap-y-4 lg:pr-4">
                {currentOffers?.length !== 0 && (
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
                      : currentOffers
                          ?.slice(0, visibleCount)
                          .map((offer) => (
                            <OfferCard
                              key={offer._id}
                              offer={offer}
                              isSelected={selectedOffer?._id === offer._id}
                              onClick={() => handleSelect(offer)}
                            />
                          ))}

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

                {currentOffers?.length === 0 && (
                  <div className="pt-8">
                    {/* //TODO FIX this if dc offers exists */}
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

              <div className="sticky top-0 self-start h-fit  ">
                {actionType === 'buy' && (
                  <div className="absolute w-full z-10">
                    <BuyOrder
                      setActionType={setActionType}
                      actionType={actionType}
                    />
                  </div>
                )}

                <div
                  className={`flex flex-col bg-mainBg rounded-b-xl max-h-[90vh] ${
                    actionType === 'buy' ? 'opacity-20' : 'opacity-100'
                  }`}
                  // style={{
                  //   overflowY: 'auto', // scroll działa tylko wewnątrz tego div
                  //   scrollbarWidth: 'none',
                  //   msOverflowStyle: 'none',
                  // }}
                >
                  {!isLoading &&
                    selectedOffer &&
                    currentOffers?.length !== 0 && (
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
