import Link from 'next/link';
import OrderCard from './OrderCard';
import RateUser from './RateUser';
import { useOrders } from '@/contexts/OrdersContext';

export default function BuyOrdersView() {
  const { state } = useOrders();
  const { orders, isLoading } = state;
  const { buyOrders } = orders;
  const sortedBuyOrders = buyOrders.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  if (buyOrders.length > 0 && !isLoading) {
    return (
      <div className="">
        <div className="bg-brighterBg p-6 mb-4">
          {buyOrders.length > 0 && (
            <>
              {sortedBuyOrders.map((order) => (
                <div
                  key={order._id}
                  className={`bg-mainBg ${
                    order?.orderStatus === 'finalized' ? '' : 'mb-4'
                  }`}
                >
                  <OrderCard order={order} />
                  {order?.orderStatus === 'finalized' && (
                    <RateUser order={order} />
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    );
  }
  if (orders?.buyOrders?.length === 0) {
    return (
      <>
        <div className="opacity-0 animate-fade-in animation-delay-400 p-6 bg-mainBg shadow-xl">
          <p className="text-lg">Nie złożyłeś jeszcze żadnego zamówienia...</p>
          <p>
            Sprawdź oferty{' '}
            <span className="font-bold text-red-300">
              <Link href={'/marketplace/offers'}>tutaj</Link>
            </span>
          </p>
        </div>
      </>
    );
  }
}
