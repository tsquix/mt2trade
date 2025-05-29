import Link from 'next/link';
import OrderCard from './OrderCard';
import { OrderActions } from './OrderActions';

export default function SellOrdersView({
  orders,
  deleteOrder,
  handleStatusChange,
  handleUpdateOffer,
  isLoading,
}) {
  const { sellOrders } = orders;

  return (
    <div className="bg-mainBg p-12 shadow-2xl mb-12">
      <h1>ktos chce kupic od ciebie:</h1>
      <>
        <div className="bg-brighterBg p-4 my-8 rounded-lg">
          {sellOrders.length > 0 ? (
            <>
              {orders?.sellOrders?.map((order) => (
                <>
                  <div key={order._id} className="mb-4 flex justify-between">
                    <OrderCard
                      key={order._id}
                      order={order}
                      deleteOrder={deleteOrder}
                    >
                      <OrderActions
                        order={order}
                        handleStatusChange={handleStatusChange}
                        handleUpdateOffer={handleUpdateOffer}
                        isLoading={isLoading}
                      />
                    </OrderCard>
                  </div>
                </>
              ))}
            </>
          ) : (
            <>
              <p className="text-lg">
                Nie masz jeszcze żadnych zleceń sprzedaży
              </p>
              <p>
                Swoje oferty znajdziesz na swoim{' '}
                <span className="font-bold text-red-300">
                  <Link href={'/profile'}>profilu</Link>
                </span>
              </p>
            </>
          )}
        </div>
      </>
    </div>
  );
}
