import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import { socket } from '../../public/socket';
import { useEffect } from 'react';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

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
