import OfferCard from './OfferCard';
import OfferDetailPage from './OfferDetailPage';

export default function OffersView({ offers }) {
  const { state, dispatch } = useOrders();
  const { selectedOffer } = state;

  return (
    <div className="bg-mainBg p-12 shadow-2xl">
      <div className="flex">
        {offers?.map((offer) => (
          <OfferCard
            key={offer._id}
            offer={offer}
            isSelected={selectedOffer?._id === offer._id}
            onClick={() =>
              dispatch({
                type: 'SET_SELECTED_OFFER',
                payload: offer,
              })
            }
            // isLoading={isLoading}
          />
        ))}
      </div>
      <div className="sticky top-10 h-screen overflow-auto">
        <div className="flex bg-mainBg rounded-3xl">
          {selectedOffer && <OfferDetailPage offers={offers} />}
        </div>
      </div>
    </div>
  );
}
