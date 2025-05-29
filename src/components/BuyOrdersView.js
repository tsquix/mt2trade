import Link from 'next/link';
import OrderCard from './OrderCard';

export default function BuyOrdersView({ orders, deleteOrder }) {
  const { buyOrders } = orders;
  const sortedBuyOrders = buyOrders.sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return (
    <div className="bg-mainBg p-12 shadow-2xl mb-12">
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
                    <>
                      {/* TODO  ZROBIC OBSLUIGE REPUTACJI*/}
                      <div className="flex justify-center mb-4 bg-mainBg p-4  shadow-md">
                        <div className="flex flex-col items-center text-white">
                          <p className="mb-4">
                            Czy transakcja przebiegła pomyślnie?
                          </p>
                          <div className="flex gap-6 justify-center">
                            <button className="bg-brighterBg px-6 py-2 text-lg rounded-lg text-red-300 hover:opacity-60">
                              Tak
                            </button>
                            <button className="bg-red-300 text-white text-lg px-6 py-2 rounded hover:opacity-60 transition">
                              Nie
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
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
