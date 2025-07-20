import axios from 'axios';
import { createContext, useContext, useReducer } from 'react';
import { socket } from '../../public/socket.js';
const OrdersContext = createContext();

const initialState = {
  view: 'buy',
  orders: {
    buyOrders: [],
    sellOrders: [],
  },
  pendingOffers: {
    buyOffersId: [],
    sellOffersId: [],
  },
  userOffers: [],
  serverOffers: [],
  selectedOffer: '',
  isLoading: true,
  isOfferSold: false,
};

function ordersReducer(state, action) {
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
      const offerToUpdate = state.offers.find((offer) => offer._id === offerId);
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
    case 'REFRESH_EDITED_OFFER':
      return {
        ...state,
        selectedOffer: {
          ...state.selectedOffer,
          ...action.payload,
        },
      };
    case 'SET_USER_OFFERS':
      return { ...state, userOffers: action.payload };
    case 'SET_SERVER_OFFERS':
      return { ...state, serverOffers: action.payload };
    case 'SET_SELECTED_OFFER':
      return { ...state, selectedOffer: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'CLEAR_OFFER_SOLD_FLAG':
      return { ...state, isOfferSold: false };
    default:
      return state;
  }
}
export function OrdersProvider({ children, session }) {
  const [state, dispatch] = useReducer(ordersReducer, initialState);

  const handleStatusChange = async (status, orderId) => {
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
  };
  const handleUpdateOffer = async (order) => {
    dispatch({ type: 'SET_LOADING', payload: true });

    const offerToUpdate = state.userOffers.find(
      (offer) => offer._id === order.offer._id
    );
    const newCurrAmount = offerToUpdate.currencyAmount - order.currencyAmount;

    if (offerToUpdate.currencyAmount < order.currencyAmount) {
      await Swal.fire({
        title: 'Błąd aktualizacji!',
        text: 'Ilość waluty w zamówieniu przekracza dostępną ilość w ofercie.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }

    if (newCurrAmount < 0) {
      dispatch({ type: 'SET_LOADING', payload: false });
      return;
    }
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
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

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
      await fetchBuyOrders();
    } catch (err) {
      console.error('Error deleting order:', err);
    }
    // }
  };
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
  const fetchUserOffers = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get(`/api/offer?userId=${session?.user.id}`);

      dispatch({
        type: 'SET_USER_OFFERS',
        payload: response.data.offers,
      });
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const fetchServerOffers = async (server) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await axios.get(`/api/offer?server=${server}`);

      dispatch({
        type: 'SET_SERVER_OFFERS',
        payload: response.data.offers,
      });
      // Auto-select first offer if available
      if (response.data.offers && response.data.offers.length > 0) {
        dispatch({
          type: 'SET_SELECTED_OFFER',
          payload: response.data.offers[0] || null,
        });
      } else {
      }
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const value = {
    state,
    dispatch,
    actions: {
      handleStatusChange,
      handleUpdateOffer,
      deleteOrder,
      fetchBuyOrders,
      fetchUserOffers,
      fetchServerOffers,
    },
  };

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
}

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders must be used within OrdersProvider');
  }
  return context;
};
