import Header from '@/components/layout/Header';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/600.css';
import '@fontsource/poppins/700.css';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <div className="flex flex-col mx-auto max-w-6xl px-6  justify-center">
        {children}
      </div>
    </>
  );
}
