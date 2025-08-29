import Link from 'next/link';
import OrderCard from './OrderCard';
import { OrderActions } from './OrderActions';
import { useOrders } from '@/contexts/OrdersContext';

export default function SellOrdersView() {
  const { state } = useOrders();
  const { orders } = state;
  const { sellOrders } = orders;
  const sortedSellOrders = sellOrders.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className=" mb-12">
      <>
        {sellOrders.length > 0 ? (
          <div className=" p-6 mb-4 bg-brighterBg ">
            {sortedSellOrders?.map((order) => (
              <>
                <div key={order._id} className="mb-4 bg-brighterBg">
                  <OrderCard key={order._id} order={order}>
                    <OrderActions order={order} />
                  </OrderCard>
                </div>
              </>
            ))}
          </div>
        ) : (
          <>
            <div className="opacity-0 animate-fade-in animation-delay-400 bg-mainBg shadow-2xl p-6">
              <p className="text-lg">
                Nie masz żadnych oczekujących zamówień...
              </p>
              <p>
                Swoje oferty znajdziesz na swoim{' '}
                <span className="font-bold text-red-300">
                  <Link href={'/profile'}>profilu</Link>
                </span>
              </p>
            </div>
          </>
        )}
      </>
    </div>
  );
}
