import { useState, useEffect, useCallback } from 'react';
import { useOrders } from '@/contexts/OrdersContext';
import { OFFER_VIEWS } from '@lib/constants/marketplace';

export const useOfferView = (discordThreadsLength) => {
  const { dispatch } = useOrders();
  const [offersView, setOffersView] = useState(OFFER_VIEWS.REGULAR);

  //  początkowy widok
  useEffect(() => {
    if (discordThreadsLength === 0) {
      setOffersView(OFFER_VIEWS.REGULAR);
    } else {
      setOffersView(OFFER_VIEWS.DISCORD);
    }
  }, [discordThreadsLength]);

  // ustaw pierwszą ofertę po zmianie widoku
  const handleViewChange = useCallback(
    (newView, regularOffers, discordOffers) => {
      setOffersView(newView);

      const offers =
        newView === OFFER_VIEWS.REGULAR ? regularOffers : discordOffers;
      if (offers?.length > 0) {
        dispatch({
          type: 'SET_SELECTED_OFFER',
          payload: offers[0],
        });
      }
    },
    [dispatch]
  );

  return { offersView, setOffersView: handleViewChange };
};
