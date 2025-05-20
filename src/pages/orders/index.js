import PushNotification from '@/components/notification/PushNotification';
import OfferCard from '@/components/OfferCard';
import Layout from '@/pages/layout';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';
export default function OrdersPage() {
  const [view, setView] = useState('buy');
  const [orders, setOrders] = useState({ buyOrders: [], sellOrders: [] });
  const { buyOrders, sellOrders } = orders;

  const { data: session } = useSession();

  const [selectedOffer, setSelectedOffer] = useState(null);
  const [pendingOffersId, setPendingOrdersId] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const socket = io('http://localhost:4001');

  useEffect(() => {
    // dołącz do pokoju zamówienia
    socket.emit('join-order-room', pendingOffersId);

    // nasłu chuj aktualizacji statusu
    socket.on('order-updated', ({ orderId: id, status }) => {
      if (pendingOffersId.includes(id)) {
        // console.log('success');
        // console.log(buyOrders.filter((order) => order._id === id).orderStatus);

        const orderToUpdate = buyOrders.find((order) => order._id === id);
        if (!orderToUpdate) return;
        const updatedOrder = { ...orderToUpdate, orderStatus: status };
        // console.log(updatedOrder);

        // const newBuyOrdersArray = buyOrders.filter((order) => (order.id == id));
        setOrders((prev) => ({
          ...prev,
          buyOrders: [
            ...prev.buyOrders.filter((order) => order._id !== id),
            updatedOrder,
          ],
        }));
        // console.log(orders);
      }
    });

    return () => {
      socket.off('order-updated');
    };
  }, [pendingOffersId]);

  async function handleStatusChange(status, orderId) {
    socket.emit('order-status-updated', {
      orderId,
      status,
    });

    try {
      setIsLoading(true);
      //BUG pass status  n order as object
      await axios.put('/api/buyOrder', { status, orderId });
      // await axios.put('/api/buyOrder', status, orderId);
    } catch (err) {
      console.error(err);
    } finally {
      console.log(
        'buyorder status updated successfully : ' + status + ' ' + orderId
      );
      await fetchBuyOrders();

      setIsLoading(false);
    }
  }

  const fetchBuyOrders = async () => {
    try {
      // setIsLoading(true);
      const response = await axios.get(
        `/api/buyOrder?userId=${session?.user.id}`
      );
      setOrders(response.data.orders);

      setPendingOrdersId(
        response.data.orders?.buyOrders
          ?.filter((order) => order.orderStatus === 'pending')
          .map((order) => order._id)
      );
    } catch (error) {
      console.error('Error fetching offers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user.id) {
      fetchBuyOrders();
    }
  }, [session?.user.id]);
  // useEffect(() => {
  //   console.log(pendingOffersId);
  // }, [pendingOffersId]);
  // useEffect(() => {
  //   console.log(orders);
  // }, [orders]);
  const deleteOrder = async (orderId) => {
    const result = await Swal.fire({
      title: 'Usuń zamówienie',
      text: 'Czy na pewno chcesz usunąć to zamówienie??',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Usuń',
      cancelButtonText: 'Anuluj',
      reverseButtons: true,
      customClass: {
        confirmButton:
          'mx-4 px-3 py-2 bg-transparent text-red-500 border border-red-500 font-bold transition-colors duration-300 hover:bg-brighterBg hover:border-brighterBg outline-none ring-2 ring-brighterBg hover:text-red-500 border',
        cancelButton:
          ' mx-4 px-3 py-2 bg-transparent text-gray-500 border border-brighterBg font-bold transition-colors duration-300 hover:bg-gray-500 hover:border-brighterBg outline-none ring-2 ring-brighterBg hover:text-white border',
      },
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/api/buyOrder?orderId=${orderId}`);
      } catch (err) {
        console.error('Error deleting order:', err);
      } finally {
        await fetchBuyOrders();
      }
    }
  };
  return (
    <Layout>
      <div>
        <button
          className={`bg-mainBg px-2 py-1 ${view === 'buy' ? 'bg-red-300' : ''}`}
          onClick={() => setView('buy')}
        >
          kupuje
        </button>
        <button
          className={`bg-mainBg px-2 py-1 ${view === 'sell' ? 'bg-red-300' : ''}`}
          onClick={() => setView('sell')}
        >
          sprzedaje
        </button>
      </div>
      {view === 'buy' ? (
        <div className="bg-mainBg p-12 shadow-2xl mb-12">
          <h1>kupuje</h1>
          <PushNotification />
          {buyOrders && (
            <>
              <div className="bg-brighterBg p-4 my-8 rounded-lg">
                {orders.buyOrders.length > 0 ? (
                  <>
                    {orders?.buyOrders?.map((order) => (
                      <>
                        <div
                          key={order._id}
                          className="p-4   bg-mainBg flex justify-between"
                        >
                          <div>
                            <p>Buyer: {order?.buyer?.name || 'N/A'}</p>
                            <p>Seller: {order?.seller?.name || 'N/A'}</p>
                            <p>Server: {order?.offer?.serverName || 'N/A'}</p>
                            <p>Amount: {order?.currencyAmount || 0} yang</p>
                            <p>Price: {order?.offer?.pricePLN || 0} PLN</p>
                            <p
                              className={
                                order?.orderStatus === `accepted`
                                  ? 'text-green-300'
                                  : ''
                              }
                            >
                              Status:{' '}
                              {order?.orderStatus === 'pending'
                                ? 'oczekuje'
                                : order?.orderStatus || 'N/A'}
                            </p>
                          </div>

                          <div>
                            <button
                              type="button"
                              className="text-xl"
                              onClick={() => deleteOrder(order._id)}
                            >
                              X
                            </button>
                          </div>
                        </div>
                        {order?.orderStatus === 'accepted' && (
                          <>
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
          )}
        </div>
      ) : (
        <div className="bg-mainBg p-12 shadow-2xl mb-12">
          <h1>ktos chce kupic od ciebie:</h1>
          {buyOrders && (
            <>
              <div className="bg-brighterBg p-4 my-8 rounded-lg">
                {orders.sellOrders.length > 0 ? (
                  <>
                    {orders?.sellOrders?.map((order) => (
                      <>
                        <div
                          key={order._id}
                          className="mb-4 flex justify-between"
                        >
                          <div>
                            <p>Buyer: {order.buyer.name}</p>
                            <p>Seller: {order.seller.name}</p>
                            <p>Server: {order.offer.serverName}</p>
                            <p>Amount: {order.currencyAmount} yang</p>
                            <p>Price: {order.offer.pricePLN} PLN</p>
                            <p>
                              Status:{' '}
                              <span
                                className={
                                  order.orderStatus === 'accepted'
                                    ? 'text-green-300'
                                    : order.orderStatus === 'rejected'
                                      ? 'text-red-300'
                                      : ''
                                }
                              >
                                {order.orderStatus}
                              </span>
                            </p>
                          </div>
                          <div>
                            <button
                              type="button"
                              className="text-xl"
                              onClick={() => deleteOrder(order._id)}
                            >
                              X
                            </button>
                          </div>
                        </div>
                        {order.orderStatus === 'pending' && (
                          // TODO zapytac czy aktualizowac zlecenie na minus currency co ktos chce kupc
                          <div className=" flex gap-4 mb-8">
                            <button
                              onClick={() =>
                                handleStatusChange('accepted', order._id)
                              }
                              className={`bg-mainBg px-4 py-2 rounded-lg hover:opacity-50 ${isLoading ? 'hover:opacity-100' : ''}`}
                              disabled={isLoading}
                            >
                              {' '}
                              Akceptuj
                            </button>
                            <button
                              onClick={() =>
                                handleStatusChange('rejected', order._id)
                              }
                              disabled={isLoading}
                              className={`bg-red-100 text-mainBg px-4 py-2 rounded-lg hover:opacity-70 ${isLoading ? 'hover:opacity-100' : ''}`}
                            >
                              {' '}
                              Odrzuć
                            </button>
                          </div>
                        )}
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
          )}
        </div>
      )}
    </Layout>
  );
}
