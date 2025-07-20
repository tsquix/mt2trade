import { createContext, useContext, useState } from 'react';

const OffersContext = createContext();

export function OffersProvider({ children }) {
  //   const [selectedOffer, setSelectedOffer] = useState(null);
  const [offers, setOffers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [visibleCount, setVisibleCount] = useState(3);

  const value = {
    offers,
    setOffers,
    isLoading,
    setIsLoading,
    visibleCount,
    setVisibleCount,
  };

  return (
    <OffersContext.Provider value={value}>{children}</OffersContext.Provider>
  );
}

export const useOffers = () => {
  const context = useContext(OffersContext);
  if (!context) {
    throw new Error('useOffers must be used within OffersProvider');
  }
  return context;
};
