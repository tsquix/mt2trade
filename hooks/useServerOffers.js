import { useEffect, useCallback } from 'react';
import { useOrders } from '@/contexts/OrdersContext';
import axios from 'axios';

export const useServerOffers = (serverSlug, initialOffers) => {
  const { state, dispatch } = useOrders();

  // sync SSR data
  useEffect(() => {
    if (initialOffers?.length && !state.serverOffers.length) {
      dispatch({ type: 'SET_SERVER_OFFERS', payload: initialOffers });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [initialOffers, state.serverOffers.length, dispatch]);

  // fetch po stronie klienta jak zmieni sie serwer
  useEffect(() => {
    if (!serverSlug) return;

    const isDataAlreadyLoaded =
      state.serverOffers.length > 0 &&
      state.serverOffers[0].serverSlug === serverSlug;

    if (isDataAlreadyLoaded) return;

    const fetchOffers = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });
      try {
        const res = await axios.get(`/api/offer?server=${serverSlug}`);
        dispatch({ type: 'SET_SERVER_OFFERS', payload: res.data.offers });
      } catch (err) {
        console.error('Error fetching offers:', err);
        dispatch({ type: 'SET_SERVER_OFFERS', payload: [] });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    fetchOffers();
  }, [serverSlug, state.serverOffers.length, dispatch]);

  return { offers: state.serverOffers, isLoading: state.isLoading };
};
