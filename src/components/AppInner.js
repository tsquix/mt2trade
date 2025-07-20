import { useSession } from 'next-auth/react';
import { OrdersProvider } from '@/contexts/OrdersContext';
import { useEffect } from 'react';
import { socket } from '../../public/socket';
import { OffersProvider } from '@/contexts/OffersContext';

export default function AppInner({ Component, pageProps }) {
  const { data: session, status } = useSession();

  useEffect(() => {
    socket.connect();
    return () => {
      socket.disconnect();
    };
  }, []);

  if (status === 'loading') return null;

  return (
    <OrdersProvider session={session}>
      <OffersProvider>
        <Component {...pageProps} />
      </OffersProvider>
    </OrdersProvider>
  );
}
