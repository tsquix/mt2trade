import Header from '@/components/Header';

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
