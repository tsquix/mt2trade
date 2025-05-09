import OfferCard from '@/components/OfferCard';
import Layout from '@/pages/layout';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useCallback, useEffect, useState } from 'react';

export default function OrdersPage() {
  const [view, setView] = useState('buy');
  const [orders, setOrders] = useState({ buyOrders: [], sellOrders: [] });
  const { buyOrders, sellOrders } = orders;
  const { data: session } = useSession();
  const [selectedOffer, setSelectedOffer] = useState(null);

  // const sendNotification = () => {
  //   if ('Notification' in window && Notification.permission === 'granted') {
  //     new Notification('New Order Notification', {
  //       body: 'This is a test notification',
  //     });
  //   } else {
  //     requestNotificationPermission();
  //   }
  // };
  // const requestNotificationPermission = useCallback(() => {
  //   if ('Notification' in window) {
  //     Notification.requestPermission().then(function (permission) {
  //       if (permission === 'granted') {
  //         console.log('permision granted');
  //         sendNotification();
  //       }
  //     });
  //   }
  // }, []);

  // useEffect(() => {
  //   if ('Notification' in window) {
  //     requestNotificationPermission();
  //   }
  // }, [requestNotificationPermission]);

  async function subscribe() {
    let sw = await navigator.serviceWorker.ready;
    let push = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey:
        'BEy9M0NM8txQ1yRYTHXFYL5588f3pR1u-em5StnrvXLaLLW-EKzyWKjinlEe7CGij5WfJ75dyC9rKXB8NDBDCRI',
    });
    console.log(JSON.stringify(push));
  }
  useEffect(() => {
    async function name() {
      let sw = await navigator.serviceWorker.register('./sw.js');
      console.log(sw);
    }
    name();
  }, []);
  useEffect(() => {
    console.log(orders);
  }, [orders]);
  useEffect(() => {
    const fetchBuyOrders = async () => {
      try {
        // setIsLoading(true);
        const response = await axios.get(
          `/api/buyOrder?userId=${session?.user.id}`
        );
        setOrders(response.data.orders);
      } catch (error) {
        console.error('Error fetching offers:', error);
      } finally {
        // setIsLoading(false);
      }
    };

    if (session?.user.id) {
      fetchBuyOrders();
    }
  }, [session?.user.id]);
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
          {buyOrders && (
            <>
              <div>
                <button
                  onClick={subscribe}
                  className="bg-brighterBg px-4 py-2 rounded-lg hover:bg-red-300 transition-colors"
                >
                  Subscribe
                </button>
                {orders?.buyOrders?.map((order) => (
                  <div key={order._id} className="bg-brighterBg p-4 rounded-lg">
                    <p>Buyer: {order.buyer.name}</p>
                    <p>Seller: {order.seller.name}</p>
                    <p>Server: {order.offer.serverName}</p>
                    <p>Amount: {order.currencyAmount} yang</p>
                    <p>Price: {order.offer.pricePLN} PLN</p>
                    <p>Status: {order.orderStatus}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="bg-mainBg p-12 shadow-2xl mb-12">
          <h1>ktos chce kupic od ciebie:</h1>
          {buyOrders && (
            <>
              <div>
                {orders?.sellOrders?.map((order) => (
                  <div key={order._id} className="bg-brighterBg p-4 rounded-lg">
                    <p>Buyer: {order.buyer.name}</p>
                    <p>Seller: {order.seller.name}</p>
                    <p>Server: {order.offer.serverName}</p>
                    <p>Amount: {order.currencyAmount} yang</p>
                    <p>Price: {order.offer.pricePLN} PLN</p>
                    <p>Status: {order.orderStatus}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </Layout>
  );
}
