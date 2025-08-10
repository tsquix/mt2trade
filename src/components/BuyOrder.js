import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { socket } from '../../public/socket.js';
import UserDisplay from './UserDisplayOffer/UserDisplay.js';
import { useOrders } from '@/contexts/OrdersContext.js';

export default function BuyOrder({ setActionType, actionType }) {
  const { state } = useOrders();
  const { selectedOffer } = state;
  const [currencyCount, setCurrencyCount] = useState(1);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActionType(null);
      }
    };

    if (actionType) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [actionType, setActionType]);
  useEffect(() => {
    setNewBuyOrder((prev) => ({
      ...prev,
      buyer: session?.user,
      currencyAmount: currencyCount,
    }));
  }, [session, currencyCount]);

  const [newBuyOrder, setNewBuyOrder] = useState({
    offer: selectedOffer,
    seller: selectedOffer.seller._id,
    buyer: session?.user,
    currencyAmount: currencyCount,
  });

  const handleCurrChange = (e) => {
    setCurrencyCount(Number(e.target.value));
  };

  const createBuyOrder = async (e) => {
    e.preventDefault();
    if (!session) return alert('aby kupić walute musisz się zalogować');

    try {
      const orderToSubmit = {
        ...newBuyOrder,
        currencyAmount: currencyCount,
      };

      const response = await axios.post(`/api/buyOrder`, orderToSubmit);
      if (response.data.success) {
        const orderId = response.data.data._id;
        router.push('/orders');
        socket.emit('new-purchase-request', {
          orderId,
          selectedOffer,
        });
      }
    } catch (error) {
      console.error('Error creating buy order:', error);
    }
  };

  const totalPrice = (
    (currencyCount * selectedOffer.pricePLN) /
    selectedOffer.currencyAmount
  ).toFixed(2);

  return (
    <div className="bg-brighterBg p-6 rounded-2xl shadow-lg text-white relative ">
      {/* Zamknij */}
      <button
        onClick={() => setActionType(null)}
        className="absolute top-4 right-4 text-red-400 text-3xl font-bold hover:text-red-600"
        title="Zamknij"
      >
        ×
      </button>

      <h2 className="text-xl font-semibold py-4 mb-6">Kupujesz od: </h2>
      <div className="border-t border-b border-gray-700 py-4 mb-6">
        <UserDisplay
          offer={selectedOffer}
          height={45}
          width={45}
          classNameImg={''}
        />
      </div>
      {/* Slider */}

      <div className="bg-mainBg rounded-lg p-4 flex items-center gap-4 mb-4">
        <label className="whitespace-nowrap font-semibold text-sm">
          Podaj ilość waluty: {currencyCount}
        </label>
        <input
          type="range"
          min="1"
          max={selectedOffer.currencyAmount}
          value={currencyCount}
          onChange={handleCurrChange}
          className="w-full accent-red-300"
        />
        <span className="whitespace-nowrap text-green-400 font-medium">
          {totalPrice} zł
        </span>
      </div>

      {/* Przycisk kupna */}
      <button
        onClick={createBuyOrder}
        className=" bg-red-300 hover:bg-red-400 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center w-full"
        value={'buy'}
      >
        Kup teraz
      </button>
    </div>
  );
}
