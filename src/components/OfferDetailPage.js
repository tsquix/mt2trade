import axios from 'axios';
import { memo, useEffect, useState } from 'react';
import TitleRating from '@/components/TittleRating';
import UserDisplay from '@/components/UserDisplayOffer/UserDisplay';
import OfferDetails from '@/components/UserDisplayOffer/OfferDetails';
import DeliveryInfo from '@/components/UserDisplayOffer/DeliveryInfo';
import { useOrders } from '@/contexts/OrdersContext';
import { useSession } from 'next-auth/react';

function OfferDetailPage({
  handleBuy,
  mode = 'default', // default or profile,
  status,
  setStatus, // edit or view
}) {
  const { data: session } = useSession();
  const { state, actions, dispatch } = useOrders();
  const { isLoading, selectedOffer } = state;

  const [newOffer, setNewOffer] = useState({
    title: '',
    currencyAmount: '',
    pricePLN: '',
    description: '',
  });
  //TODO adda validation, prevent empty input
  //TODO prevent buying own offer
  //TODO add bg highlight to own offers
  useEffect(() => {
    if (selectedOffer) {
      setNewOffer({
        title: selectedOffer.title || '',
        currencyAmount: selectedOffer.currencyAmount || '',
        pricePLN: selectedOffer.pricePLN || '',
        description: selectedOffer.description || '',
      });
    }
  }, [selectedOffer]);
  const handleEdit = (field, value) => {
    setNewOffer((prev) => ({ ...prev, [field]: value }));
  };
  if (isLoading) {
    return (
      <div className="bg-mainBg p-6 flex flex-col animate animate-pulse border rounded-xl w-full ">
        <div className="px-1 mb-3 py-1 bg-brighterBg  w-32 rounded-3xl text-xs "></div>
        <div className="border-t border-b border-gray-700 py-4 mb-6">
          <div className="px-1 mb-3 py-1 bg-brighterBg  w-32 rounded-3xl text-xs "></div>
          <div className="px-1 mb-8 py-1 bg-brighterBg  w-16 rounded-3xl text-xs "></div>
          <div className="flex justify-between">
            <div className="px-1 mb-3 py-3 bg-brighterBg  w-32 rounded-3xl text-xs "></div>
            <div className="px-1 mb-3 py-3 bg-brighterBg  w-32 rounded-3xl text-xs "></div>
            <div className="px-1 mb-3 py-3 bg-brighterBg  w-32 rounded-3xl text-xs "></div>
          </div>
        </div>
        <div className="px-1 mb-10 py-1 bg-brighterBg  w-32 rounded-3xl text-xs "></div>
        <div className="px-1 mb-3 py-1 bg-brighterBg  w-32 rounded-3xl text-xs "></div>
        <div className="px-1 mb-3 py-1 bg-brighterBg  w-48 rounded-3xl text-xs "></div>
        <div className="px-1 mb-3 py-1 bg-brighterBg  w-64 rounded-3xl text-xs "></div>

        <div className="bg-mainBg rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-2">
            <div className="flex-1">
              <div className="px-1 mb-3 py-1 bg-brighterBg  w-16 rounded-3xl text-xs "></div>
              <div className="px-1 mb-3 py-4 bg-brighterBg  w-full rounded-xl text-xs "></div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="px-1 mb-3 py-4 bg-brighterBg  w-full rounded-3xl text-xs "></div>
          <div className="px-1 mb-3 py-4 bg-brighterBg  w-full rounded-3xl text-xs "></div>
        </div>
      </div>
    );
  }
  // useEffect(() => {
  //   console.log(selectedOffer);
  //   console.log(session);
  // }, [selectedOffer]);
  const edit = async (edit, saveEdit) => {
    setStatus(edit);
    //
    if (saveEdit && selectedOffer.seller.name === session.user.name) {
      if (selectedOffer.title !== newOffer.title) {
        const toSlug = true;
        await axios.put('/api/offer', {
          offerId: selectedOffer._id,
          newOffer,
          toSlug,
        });
      } else {
        await axios.put('/api/offer', {
          offerId: selectedOffer._id,
          newOffer,
        });
      }
      await actions.fetchUserOffers();
      dispatch({
        type: 'REFRESH_EDITED_OFFER',
        payload: newOffer,
      });
    }
  };
  //TODO w default zapisac w cache ostatni selected offer i go ustawic po ponownym wejsciu na strone
  if (selectedOffer) {
    return (
      // <Layout>
      <>
        <div className="bg-brighterBg p-6 flex flex-col rounded-b-xl w-full ">
          <TitleRating
            offer={selectedOffer}
            displayRatingNumber={true}
            className={'mb-2'}
            mode={mode}
            status={status}
            newOffer={newOffer}
            handleEdit={handleEdit}
          />
          <div className="border-t border-b border-gray-700 py-4 mb-6">
            <UserDisplay
              offer={selectedOffer}
              height={45}
              width={45}
              classNameImg={''}
            />
          </div>
          <OfferDetails
            selectedOffer={selectedOffer}
            mode={mode}
            status={status}
            newOffer={newOffer}
            handleEdit={handleEdit}
          />
          {mode === 'default' && <DeliveryInfo />}
          {mode === 'default' && (
            <div className="bg-mainBg rounded-lg p-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4 mb-2">
                <div className="flex-1">
                  <label className="block text-sm text-gray-400 mb-1">
                    Character Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your character name"
                    className="w-full bg-brighterBg border border-gray-700 rounded-lg py-2 px-3"
                  />
                </div>
              </div>
            </div>
          )}

          {mode === 'default' ? (
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="flex-1 bg-red-300 hover:bg-red-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center"
                value={'buy'}
                onClick={(e) => handleBuy(e)}
              >
                Kup teraz
              </button>
              <button className="flex-1 bg-transparent hover:bg-gray-700 text-white font-medium py-3 px-6 border border-gray-600 rounded-lg transition-colors duration-200 flex items-center justify-center">
                Zarezerwuj oferte
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              {status !== 'edit' ? (
                <button
                  className="flex-1 bg-blue-300 hover:bg-blue-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center max-w-xs"
                  onClick={() => edit('edit')}
                >
                  Edytuj
                </button>
              ) : (
                <div className="flex gap-4">
                  <button
                    className=" bg-green-400 hover:bg-green-300 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200  items-center justify-center max-w-xs"
                    onClick={() => edit('view', 'saveEdit')}
                  >
                    Zakończ edycje
                  </button>
                  <button
                    className="bg-red-400 hover:bg-red-300 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 items-center justify-center max-w-xs"
                    onClick={() => edit('view')}
                  >
                    Odrzuć zmiany
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </>
    );
  }
}
export default memo(OfferDetailPage);
