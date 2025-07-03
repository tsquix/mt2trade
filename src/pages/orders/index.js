import PushNotification from '@/components/notification/PushNotification';
import Layout from '@/pages/layout';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useReducer, useState } from 'react';
import { socket } from '../../../public/socket.js';
import Swal from 'sweetalert2';
import ViewSelect from '@/components/ViewSelect.js';
import SellOrdersView from '@/components/SellOrdersView.js';
import BuyOrdersView from '@/components/BuyOrdersView.js';
import OffersView from '@/components/OffersView.js';

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
    isLoading: true,
    isOfferSold: false,
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const { view, orders, pendingOffers, isLoading, offers } = state;
  const { buyOffersId, sellOffersId } = pendingOffers;

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
      const handleAlert = async (order) => {
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
      dispatch({ type: 'SET_LOADING', payload: true });
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
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get(`/api/offer?userId=${session?.user.id}`);
      const offers = response.data.offers;
      dispatch({
        type: 'SET_OFFERS',
        payload: offers,
      });
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };
  useEffect(() => {
    if (session?.user.id) {
      dispatch({ type: 'SET_LOADING', payload: true });
      Promise.all([fetchBuyOrders(), fetchOffers()]).finally(() => {
        dispatch({ type: 'SET_LOADING', payload: false });
      });
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

  const onViewChange = function (key) {
    dispatch({ type: 'SET_VIEW', payload: key });
  };
  const handleUpdateOffer = async (order) => {
    const offerToUpdate = offers.find((offer) => offer._id === order.offer._id);
    const newCurrAmount = offerToUpdate.currencyAmount - order.currencyAmount;
    if (offerToUpdate.currencyAmount < order.currencyAmount) {
      await Swal.fire({
        title: 'Błąd aktualizacji!',
        text: 'Ilość waluty w zamówieniu przekracza dostępną ilość w ofercie.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      return;
    }

    if (newCurrAmount < 0) return;

    try {
      // Aktualizacja oferty
      await axios.put('/api/offer', {
        offerId: order.offer._id,
        newCurrAmount,
      });
      // Aktualizacja flagi
      await axios.put('/api/buyOrder', {
        orderId: order._id,
        currencyUpdated: true,
      });

      dispatch({
        type: 'UPDATE_OFFER_CURRENCY_AMOUNT',
        payload: {
          currencyAmount: order.currencyAmount,
          offerId: order.offer._id,
        },
      });
    } catch (error) {
      console.error('Błąd podczas aktualizacji:', error);
    }
  };
  return (
    <Layout>
      <PushNotification />
      <ViewSelect view={view} onViewChange={onViewChange} />
      {/* {view === 'buy' ? (
        isLoading ? (
          <BuyOrdersView
            orders={orders}
            deleteOrder={deleteOrder}
            isLoading={true}
          />
        ) : (
          <BuyOrdersView
            orders={orders}
            deleteOrder={deleteOrder}
            isLoading={isLoading}
          />
        )
      ) : null}

      {view === 'sell' && (
        <SellOrdersView
          orders={orders}
          deleteOrder={deleteOrder}
          handleStatusChange={handleStatusChange}
          handleUpdateOffer={handleUpdateOffer}
          isLoading={isLoading}
        />
      )}
      {view === 'offers' && (
        <OffersView offers={offers} isLoading={isLoading} />
      )} */}

      {
        // isLoading ? (
        //   <div className="bg-brighterBg  p-6">
        //     <div className="bg-mainBg p-6 mb-4">
        //       <div className="h-2 w-32 bg-brighterBg animate-pulse mb-2"></div>
        //       <div className="h-2 w-12 bg-brighterBg animate-pulse"></div>
        //     </div>
        //   </div>
        // ) :
        view === 'buy' ? (
          <BuyOrdersView
            orders={orders}
            deleteOrder={deleteOrder}
            isLoading={isLoading}
          />
        ) : view === 'sell' ? (
          <SellOrdersView
            orders={orders}
            deleteOrder={deleteOrder}
            handleStatusChange={handleStatusChange}
            handleUpdateOffer={handleUpdateOffer}
            isLoading={isLoading}
          />
        ) : (
          <OffersView offers={offers} isLoading={isLoading} />
        )
      }
    </Layout>
  );
}
