import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { socket } from '../../public/socket';
import { useEffect } from 'react';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  useEffect(() => {
    socket.connect(); // tylko raz
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
