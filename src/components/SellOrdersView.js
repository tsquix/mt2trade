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
    <div className=" mb-12">
      <>
        {sellOrders.length > 0 ? (
          <div className=" p-6 mb-4 bg-brighterBg ">
            {orders?.sellOrders?.map((order) => (
              <>
                <div key={order._id} className="mb-4 bg-brighterBg">
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
          </div>
        ) : (
          <>
            <div className="opacity-0 animate-fade-in animation-delay-400 bg-mainBg shadow-2xl p-6">
              <p className="text-lg">Nie masz złożonych żadnych zamówień...</p>
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
