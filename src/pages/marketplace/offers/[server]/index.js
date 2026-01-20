import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef, useCallback } from 'react';
import axios from 'axios';

import BuyOrder from '@/components/orders/BuyOrder';
import FilterAndSearch from '@/components/ui/FilterAndSearch';
import { useOrders } from '@/contexts/OrdersContext';
import ViewSelect from '@/components/ui/ViewSelect';
import OfferDetailPage from '@/components/marketplace/offers/OfferDetailPage';
import { useFilterByRegex } from '@hooks/useFilterByRegex';
import ServerImageCard from '@/components/marketplace/offers/ServerImageCard';
import MarketplaceTour from '@/components/marketplace/offers/MarketplaceTour';
import { useServerOffers } from '@hooks/useServerOffers';
import { useDiscordOffers } from '@hooks/useDiscordOffers';
import { useInfiniteScroll } from '@hooks/useInfiniteScroll';
import { sortOffers } from '@lib/sorting/offerSorter';
import {
  OFFER_VIEWS,
  ITEMS_PER_PAGE,
  LOAD_MORE_INCREMENT,
} from '@lib/constants/marketplace';
import OfferCard from '@/components/marketplace/offers/OfferCard';

export const getServerSideProps = async (context) => {
  const { server: serverSlug } = context.params;

  try {
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

    const [offersRes, serversRes] = await Promise.all([
      axios.get(`${process.env.BASE_URL}/api/offer?server=${serverSlug}`),
      axios.get(`${process.env.BASE_URL}/api/server`),
    ]);

    if (!offersRes.data?.offers) {
      return { notFound: true };
    }

    const serverObject = serversRes.data.data.find(
      (s) =>
        s.slug === serverSlug ||
        s.name === serverSlug ||
        s.nameAlias?.includes(serverSlug)
    );

    if (!serverObject) {
      return { notFound: true };
    }

    return {
      props: {
        serverOffers: offersRes.data.offers,
        serverData: serverObject,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error?.message);
    return {
      props: {
        serverOffers: [],
        serverData: null,
        error: error?.response?.status === 404,
      },
    };
  }
};

export default function OfferPage({ serverOffers, serverData }) {
  const router = useRouter();
  const { server } = router.query;
  const { state, dispatch } = useOrders();
  const { selectedOffer } = state;

  const { offers: regularOffers } = useServerOffers(server, serverOffers);
  const { discordThreads } = useDiscordOffers(server);

  const [phrase, setPhrase] = useState('');
  const [debouncedPhrase, setDebouncedPhrase] = useState('');
  const [offersView, setOffersView] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [actionType, setActionType] = useState(null);
  const listRef = useRef(null);

  const currentOffers =
    offersView === OFFER_VIEWS.REGULAR ? regularOffers : discordThreads;

  const fieldsToFilter =
    offersView === OFFER_VIEWS.REGULAR
      ? ['title', 'description', 'seller.name']
      : ['owner.displayName', 'thread.name', 'starterMessage.content'];

  const filteredOffers = useFilterByRegex(
    debouncedPhrase,
    currentOffers,
    fieldsToFilter
  );

  useEffect(() => {
    if (discordThreads.length === 0) {
      setOffersView(OFFER_VIEWS.REGULAR);
    } else {
      setOffersView(OFFER_VIEWS.DISCORD);
      if (discordThreads.length > 0) {
        dispatch({
          type: 'SET_SELECTED_OFFER',
          payload: discordThreads[0],
        });
      }
    }
  }, [discordThreads, dispatch]);

  useEffect(() => {
    if (offersView === OFFER_VIEWS.REGULAR && regularOffers.length > 0) {
      dispatch({
        type: 'SET_SELECTED_OFFER',
        payload: regularOffers[0],
      });
    } else if (
      offersView === OFFER_VIEWS.DISCORD &&
      discordThreads.length > 0
    ) {
      dispatch({
        type: 'SET_SELECTED_OFFER',
        payload: discordThreads[0],
      });
    }
  }, [offersView, regularOffers, discordThreads, dispatch]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPhrase(phrase);
    }, 500);
    return () => clearTimeout(handler);
  }, [phrase]);

  // useInfiniteScroll(listRef, visibleCount, currentOffers?.length || 0, () =>
  //   setVisibleCount((prev) =>
  //     Math.min(prev + LOAD_MORE_INCREMENT, currentOffers?.length || 0)
  //   )
  // );

  const handleSelect = useCallback(
    (offer) => {
      dispatch({ type: 'SET_SELECTED_OFFER', payload: offer });
      router.push(
        {
          pathname: `/marketplace/offers/${server}`,
          query: { offer: offer.slug },
        },
        undefined,
        { shallow: true }
      );
    },
    [server, dispatch, router]
  );

  const handleSort = useCallback(
    (e) => {
      const sorted = sortOffers(currentOffers, e.target.value);
      dispatch({
        type: 'SET_SERVER_OFFERS',
        payload: sorted,
      });
    },
    [currentOffers, dispatch]
  );

  const handleViewChange = useCallback((newView) => {
    setOffersView(newView);
    setVisibleCount(ITEMS_PER_PAGE);
    setPhrase('');
  }, []);

  const isLoading = state.isLoading;
  const showLoader = visibleCount < currentOffers?.length;

  return (
    <Layout>
      <MarketplaceTour
        setOffersView={handleViewChange}
        serverOffersLength={state.serverOffers.length}
      />
      <div className="bg-mainBg">
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
          setView={handleViewChange}
          orders={false}
          offerCount={regularOffers.length}
          dcOfferCount={discordThreads.length}
        />

        <div className="min-h-screen">
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

                  {showLoader && (
                    <div
                      ref={listRef}
                      className="py-4 text-center text-gray-400"
                    >
                      Ładowanie więcej...
                    </div>
                  )}
                </>
              )}

              {currentOffers?.length === 0 && !isLoading && (
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

            <div className="sticky top-0 self-start h-fit">
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
              >
                {!isLoading && selectedOffer && currentOffers?.length !== 0 && (
                  <OfferDetailPage
                    handleBuy={(e) => setActionType(e.target.value)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
