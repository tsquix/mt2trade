import PushNotification from '@/components/notification/PushNotification';
import Layout from '@/pages/layout';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useReducer, useState } from 'react';
import { socket } from '../../../public/socket.js';

import Swal from 'sweetalert2';
import OfferCard from '@/components/OfferCard.js';
import OfferDetailPage from '../marketplace/offers/[server]/[offer].js';
export default function OrdersPage() {
  const { data: session } = useSession();
  const initialState = {
    view: 'sell',
    orders: {
      buyOrders: [],
      sellOrders: [],
    },
    pendingOffers: {
      buyOffersId: [],
      sellOffersId: [],
    },
    offers: [],
    isLoading: false,
  };
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [state, dispatch] = useReducer(reducer, initialState);
  const { view, orders, pendingOffers, isLoading, offers } = state;
  const { buyOrders, sellOrders } = orders;
  const { buyOffersId, sellOffersId } = pendingOffers;

  const sortedBuyOrders = buyOrders.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  function reducer(state, action) {
    switch (action.type) {
      case 'SET_VIEW':
        return { ...state, view: action.payload };
      case 'SET_ORDERS':
        return { ...state, orders: action.payload };

      case 'UPDATE_BUY_ORDER_STATUS':
        const { orderId: id, status } = action.payload;
        const buyOrderToUpdate = state.orders.buyOrders.find(
          (order) => order._id === id
        );
        if (!buyOrderToUpdate) return state;
        const updatedBuyOrder = { ...buyOrderToUpdate, orderStatus: status };
        const updatedBuyOrders = state.orders.buyOrders.map((order) =>
          order._id === id ? updatedBuyOrder : order
        );
        return {
          ...state,
          orders: {
            ...state.orders,
            buyOrders: updatedBuyOrders,
          },
        };
      case 'SET_PENDING_OFFERS':
        const { pendingSellOffers, pendingBuyOffers } = action.payload;
        return {
          ...state,
          pendingOffers: {
            buyOffersId: pendingBuyOffers,
            sellOffersId: pendingSellOffers,
          },
        };
      case 'UPDATE_OFFER_CURRENCY_AMOUNT':
        const { currencyAmount, offerId } = action.payload;
        const offerToUpdate = state.offers.find(
          (offer) => offer._id === offerId
        );
        if (offerToUpdate.currencyAmount - currencyAmount < 0) return state;

        const updatedOffer = {
          ...offerToUpdate,
          currencyAmount: offerToUpdate.currencyAmount - currencyAmount,
        };
        const updatedOffers = state.offers.map((offer) =>
          offer._id === offerId ? updatedOffer : offer
        );

        if (offerToUpdate.currencyAmount - currencyAmount === 0)
          return { ...state, offers: updatedOffers, isOfferSold: true };
        return { ...state, offers: updatedOffers };

      case 'SET_OFFERS':
        return { ...state, offers: action.payload };
      case 'SET_LOADING':
        return { ...state, isLoading: action.payload };
      case 'CLEAR_OFFER_SOLD_FLAG':
        return { ...state, isOfferSold: false };
      default:
        return state;
    }
  }
  useEffect(() => {
    if (state.isOfferSold) {
      const handleAlert = async () => {
        const result = await Swal.fire({
          title: 'W ofercie nie masz więcej waluty!',
          text: 'Czy chcesz usunąć tą ofertę?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Usuń ofertę',
          cancelButtonText: 'Aktualizuj ofertę',
          reverseButtons: true,
        });
        //TODO delete offer / update if sold
        // if (result.isConfirmed) {
        //   dispatch({ type: 'DELETE_OFFER', payload: { offerId: ... } });
        // }

        dispatch({ type: 'CLEAR_OFFER_SOLD_FLAG' });
      };

      handleAlert();
    }
  }, [state.isOfferSold]);

  useEffect(() => {
    if (!buyOffersId || buyOffersId.length === 0) return;
    socket.emit('join-order-room', buyOffersId);

    // nasłu chuj aktualizacji statusu
    socket.on('order-updated', ({ orderId, status }) => {
      if (buyOffersId.includes(orderId)) {
        dispatch({
          type: 'UPDATE_BUY_ORDER_STATUS',
          payload: { orderId, status },
        });
      }
    });
    //funkcja czysczaca
    return () => {
      socket.off('order-updated');
    };
  }, [buyOffersId]);
  useEffect(() => {
    if (!offers || offers.length === 0) return;
    const offersIds = offers?.map((offer) => offer._id);
    socket.emit('join-order-room', offersIds);

    // nasłu chuj aktualizacji statusu
    socket.on('new-purchase', ({ orderId }) => {
      console.log(orderId);
      fetchBuyOrders();
    });

    //funkcja czysczaca
    return () => {
      socket.off('new-purchase');
    };
  }, [offers]);

  async function handleStatusChange(status, orderId) {
    socket.emit('order-status-updated', {
      orderId,
      status,
    });

    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      await axios.put('/api/buyOrder', { status, orderId });
    } catch (err) {
      console.error(err);
    } finally {
      console.log(
        'buyorder status updated successfully : ' + status + ' ' + orderId
      );
      await fetchBuyOrders();
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }
  function pending(data) {
    return data
      ?.filter((order) => order.orderStatus === 'pending')
      .map((order) => order._id);
  }
  const fetchBuyOrders = async () => {
    try {
      // setIsLoading(true);
      const response = await axios.get(
        `/api/buyOrder?userId=${session?.user.id}`
      );
      dispatch({ type: 'SET_ORDERS', payload: response.data.orders });

      const pendingBuyOffers = pending(response.data.orders?.buyOrders);
      // const pendingSellOffers = pending(response.data.orders?.sellOrders);

      if (pendingBuyOffers.length > 0)
        dispatch({
          type: 'SET_PENDING_OFFERS',
          payload: { pendingBuyOffers },
        });
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  const fetchOffers = async () => {
    try {
      // setIsLoading(true);
      const response = await axios.get(`/api/offer?userId=${session?.user.id}`);
      const offers = response.data.offers;
      dispatch({
        type: 'SET_OFFERS',
        payload: offers,
      });
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      // setIsLoading(false);
    }
  };
  useEffect(() => {
    if (session?.user.id) {
      fetchBuyOrders();
      fetchOffers();
    }
  }, [session?.user.id]);
  useEffect(() => {
    console.log(offers);
  }, [offers]);

  const deleteOrder = async (orderId) => {
    // const result = await Swal.fire({
    //   title: 'Usuń zamówienie',
    //   text: 'Czy na pewno chcesz usunąć to zamówienie??',
    //   icon: 'warning',
    //   showCancelButton: true,
    //   confirmButtonText: 'Usuń',
    //   cancelButtonText: 'Anuluj',
    //   reverseButtons: true,
    //   customClass: {
    //     confirmButton:
    //       'mx-4 px-3 py-2 bg-transparent text-red-500 border border-red-500 font-bold transition-colors duration-300 hover:bg-brighterBg hover:border-brighterBg outline-none ring-2 ring-brighterBg hover:text-red-500 border',
    //     cancelButton:
    //       ' mx-4 px-3 py-2 bg-transparent text-gray-500 border border-brighterBg font-bold transition-colors duration-300 hover:bg-gray-500 hover:border-brighterBg outline-none ring-2 ring-brighterBg hover:text-white border',
    //   },
    // });

    // if (result.isConfirmed) {
    try {
      await axios.delete(`/api/buyOrder?orderId=${orderId}`);
    } catch (err) {
      console.error('Error deleting order:', err);
    } finally {
      await fetchBuyOrders();
    }
    // }
  };

  return (
    <Layout>
      <div>
        <button
          className={`bg-mainBg px-2 py-1 ${view === 'buy' ? 'bg-red-300' : ''}`}
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'buy' })}
        >
          kupuje
        </button>
        <button
          className={`bg-mainBg px-2 py-1 ${view === 'sell' ? 'bg-red-300' : ''}`}
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'sell' })}
        >
          sprzedaje
        </button>
        <button
          className={`bg-mainBg px-2 py-1 ${view === 'offers' ? 'bg-red-300' : ''}`}
          onClick={() => dispatch({ type: 'SET_VIEW', payload: 'offers' })}
        >
          Moje oferty
        </button>
      </div>
      {view === 'buy' && (
        <div className="bg-mainBg p-12 shadow-2xl mb-12">
          <h1>kupuje</h1>
          <PushNotification />
          <>
            <div className="bg-brighterBg p-4 my-8 rounded-lg">
              {orders?.buyOrders.length > 0 ? (
                <>
                  {sortedBuyOrders.map((order) => (
                    <>
                      <div
                        key={order._id}
                        className={`p-4 bg-mainBg flex justify-between ${
                          order?.orderStatus === `finalized` ? '' : 'mb-8'
                        }`}
                      >
                        <div>
                          <p>id {order._id}</p>
                          <p>tytul {order.offer.title}</p>
                          <p>Buyer: {order?.buyer?.name || 'N/A'}</p>
                          <p>Seller: {order?.seller?.name || 'N/A'}</p>
                          <p>Server: {order?.offer?.serverName || 'N/A'}</p>
                          <p>Amount: {order?.currencyAmount || 0} yang</p>
                          <p>Price: {order?.offer?.pricePLN || 0} PLN</p>
                          <p
                            className={
                              order?.orderStatus === 'accepted'
                                ? 'text-green-300'
                                : order?.orderStatus === 'finalized'
                                  ? 'text-green-500'
                                  : ''
                            }
                          >
                            Status:{' '}
                            {order?.orderStatus === 'pending'
                              ? 'oczekuje'
                              : order?.orderStatus || 'N/A'}
                          </p>
                        </div>

                        <div>
                          <button
                            type="button"
                            className="text-xl"
                            onClick={() => deleteOrder(order._id)}
                          >
                            X
                          </button>
                        </div>
                      </div>
                      {order?.orderStatus === 'finalized' && (
                        <>
                          <div className="flex justify-center mb-4 bg-mainBg p-4  shadow-md">
                            <div className="flex flex-col items-center text-white">
                              <p className="mb-4">
                                Czy transakcja przebiegła pomyślnie?
                              </p>
                              <div className="flex gap-6 justify-center">
                                <button className="bg-brighterBg px-6 py-2 text-lg rounded-lg text-red-300 hover:opacity-60">
                                  Tak
                                </button>
                                <button className="bg-red-300 text-white text-lg px-6 py-2 rounded hover:opacity-60 transition">
                                  Nie
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  ))}
                </>
              ) : (
                <>
                  <p className="text-lg">
                    Nie masz żadnych oczekujących zleceń kupna...
                  </p>
                  <p>
                    Sprawdź oferty{' '}
                    <span className="font-bold text-red-300">
                      <Link href={'/marketplace/offers'}>tutaj</Link>
                    </span>
                  </p>
                </>
              )}
            </div>
          </>
        </div>
      )}
      {view === 'sell' && (
        <div className="bg-mainBg p-12 shadow-2xl mb-12">
          <h1>ktos chce kupic od ciebie:</h1>
          <>
            <div className="bg-brighterBg p-4 my-8 rounded-lg">
              {sellOrders.length > 0 ? (
                <>
                  {orders?.sellOrders?.map((order) => (
                    <>
                      <div
                        key={order._id}
                        className="mb-4 flex justify-between"
                      >
                        <div>
                          <p>id {order._id}</p>
                          <p>tytul {order.offer.title}</p>
                          <p>Buyer: {order.buyer.name}</p>
                          <p>Seller: {order.seller.name}</p>
                          <p>Server: {order.offer.serverName}</p>
                          <p>Amount: {order.currencyAmount} yang</p>
                          <p>Price: {order.offer.pricePLN} PLN</p>
                          <p>
                            Status:{' '}
                            <span
                              className={
                                order?.orderStatus === 'accepted'
                                  ? 'text-green-300'
                                  : order?.orderStatus === 'finalized'
                                    ? 'text-green-500'
                                    : order.orderStatus === 'rejected'
                                      ? 'text-red-300'
                                      : ''
                              }
                            >
                              {order.orderStatus}
                            </span>
                          </p>
                        </div>
                        <div>
                          <button
                            type="button"
                            className="text-xl"
                            onClick={() => deleteOrder(order._id)}
                          >
                            X
                          </button>
                        </div>
                      </div>
                      {order.orderStatus === 'pending' && (
                        <div className=" flex flex-col gap-4 mb-8">
                          <div>
                            <button
                              onClick={() =>
                                handleStatusChange('accepted', order._id)
                              }
                              className={`bg-mainBg px-4 py-2 rounded-lg hover:opacity-50 ${isLoading ? 'hover:opacity-100' : ''}`}
                              disabled={isLoading}
                            >
                              {' '}
                              Akceptuj
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange('rejected', order._id)
                              }
                              disabled={isLoading}
                              className={`bg-red-100 text-mainBg px-4 py-2 rounded-lg hover:opacity-70 ${isLoading ? 'hover:opacity-100' : ''}`}
                            >
                              {' '}
                              Odrzuć
                            </button>
                          </div>
                        </div>
                      )}
                      {order.orderStatus === 'accepted' && (
                        <div className="mb-8 flex gap-4">
                          <button
                            disabled={isLoading}
                            className={`bg-red-100 text-mainBg px-4 py-2 rounded-lg hover:opacity-70 ${isLoading ? 'hover:opacity-100' : ''}`}
                            onClick={() =>
                              handleStatusChange('finalized', order._id)
                            }
                          >
                            {' '}
                            Transakcja zakończona
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange('rejected', order._id)
                            }
                            disabled={isLoading}
                            className={`bg-red-100 text-mainBg px-4 py-2 rounded-lg hover:opacity-70 ${isLoading ? 'hover:opacity-100' : ''}`}
                          >
                            {' '}
                            Coś poszło nie tak, odrzuć
                          </button>
                        </div>
                      )}
                      {order.orderStatus === 'finalized' && (
                        <div className="mb-8">
                          <button
                            disabled={isLoading}
                            className={`bg-red-100 text-mainBg px-4 py-2 rounded-lg hover:opacity-70 ${isLoading ? 'hover:opacity-100' : ''}`}
                            onClick={() =>
                              dispatch({
                                type: 'UPDATE_OFFER_CURRENCY_AMOUNT',
                                payload: {
                                  currencyAmount: order.currencyAmount,
                                  offerId: order.offer._id,
                                },
                              })
                            }
                          >
                            {' '}
                            Odejmij od oferty sprzedaną ilość waluty
                          </button>
                        </div>
                      )}
                    </>
                  ))}
                </>
              ) : (
                <>
                  <p className="text-lg">
                    Nie masz jeszcze żadnych zleceń sprzedaży
                  </p>
                  <p>
                    Swoje oferty znajdziesz na swoim{' '}
                    <span className="font-bold text-red-300">
                      <Link href={'/profile'}>profilu</Link>
                    </span>
                  </p>
                </>
              )}
            </div>
          </>
        </div>
      )}
      {view === 'offers' && (
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
    </Layout>
  );
}
