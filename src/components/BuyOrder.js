import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { socket } from '../../public/socket.js';
export default function BuyOrder({ selectedOffer, setActionType }) {
  const [currencyCount, setCurrencyCount] = useState(1);
  const { data: session } = useSession();
  const router = useRouter();
  const [newBuyOrder, setNewBuyOrder] = useState({
    offer: selectedOffer,
    seller: selectedOffer.seller._id,
    buyer: session?.user,
    currencyAmount: currencyCount,
  });
  useEffect(() => {
    console.log(newBuyOrder);
  }, [newBuyOrder]);

  async function createBuyOrder(e) {
    e.preventDefault();

    try {
      if (!session) return;

      const orderToSubmit = {
        ...newBuyOrder,
        currencyAmount: currencyCount,
      };

      const response = await axios.post(`/api/buyOrder`, orderToSubmit);
      console.log('Response:', response.data);

      if (response.data.success) {
        const orderId = response.data.data._id;
        console.log('Emitting new-purchase-request', {
          orderId,
          selectedOffer,
        });
        socket.emit('new-purchase-request', {
          orderId,
          selectedOffer,
        });

        router.push('/orders');
      }
    } catch (error) {
      console.error('Error creating buy order:', error);
    }
  }
  const handleCurrChange = (e) => {
    setCurrencyCount(e.target.value);
  };
  return (
    <div className="bg-mainBg p-6 flex relative flex-col">
      <h1>
        kupujesz od :
        <Link target="_blank" href={`/profile/${selectedOffer.seller.name}`}>
          {selectedOffer.seller.name}
        </Link>
      </h1>
      <div className="flex gap-6 w-1/2 mx-3 text-center items-center mb-8">
        <label htmlFor="" className="text-nowrap">
          ile siana {currencyCount}
        </label>
        <input
          type="range"
          min="1"
          max={selectedOffer.currencyAmount}
          value={currencyCount}
          onChange={handleCurrChange}
          className="w-full "
        />
        <div className="text-nowrap">
          {(
            (currencyCount * selectedOffer.pricePLN) /
            selectedOffer.currencyAmount
          ).toFixed(2)}{' '}
          zł
        </div>
      </div>
      <div>
        <button
          onClick={createBuyOrder}
          className="bg-brighterBg px-4 py-2 text-lg rounded-lg text-red-300"
        >
          kup tera
        </button>
      </div>
      <div className="absolute top-5 right-5">
        <button
          onClick={() => setActionType(null)}
          className="text-red-500 font-bold text-lg"
        >
          X
        </button>
      </div>
    </div>
  );
}
