import OfferDetailPage from '@/pages/marketplace/offers/[server]/[offer]';
import OfferCard from './OfferCard';
import { useState } from 'react';

export default function OffersView({ offers, isLoading }) {
  const [selectedOffer, setSelectedOffer] = useState(null);
  return (
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
              isLoading={isLoading}
            />
          )}
        </div>
      </div>
    </div>
  );
}
