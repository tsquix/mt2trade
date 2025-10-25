import '@/styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';
import AppInner from '@/components/home/AppInner';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      {/* add app wrapper so session is from = useSession() and not passed so it wont be uindefined */}
      <AppInner Component={Component} pageProps={pageProps} />
    </SessionProvider>
  );
}
