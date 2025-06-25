import Header from '@/components/Header';

export default function Layout({ children }) {
  return (
    <>
      <Header />
      <div className="flex flex-col mx-auto max-w-7xl px-4 md:px-24 lg:px-12 justify-center">
        {children}
      </div>
    </>
  );
}
