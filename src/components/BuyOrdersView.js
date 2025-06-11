import Link from 'next/link';
import OrderCard from './OrderCard';
import RateUser from './RateUser';

export default function BuyOrdersView({ orders, deleteOrder }) {
  const { buyOrders } = orders;
  const sortedBuyOrders = buyOrders.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return (
    <div className="bg-mainBg p-12 shadow-2xl mb-12 ">
      <h1>kupuje</h1>
      <>
        <div className="bg-brighterBg p-4 my-8 rounded-lg">
          {buyOrders.length > 0 ? (
            <>
              {sortedBuyOrders.map((order) => (
                <>
                  <div
                    key={order._id}
                    className={`p-4 bg-mainBg flex justify-between ${
                      order?.orderStatus === `finalized` ? '' : 'mb-8'
                    } `}
                  >
                    <OrderCard order={order} deleteOrder={deleteOrder} />
                  </div>
                  {order?.orderStatus === 'finalized' && (
                    <RateUser order={order} />
                  )}
                </>
              ))}
            </>
          ) : (
            <>
              <p className="text-lg">
                Nie masz żadnych oczekujących zleceń kupna...
              </p>
              <p>
                Sprawdź oferty{' '}
                <span className="font-bold text-red-300">
                  <Link href={'/marketplace/offers'}>tutaj</Link>
                </span>
              </p>
            </>
          )}
        </div>
      </>
    </div>
  );
}
