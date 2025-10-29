export default function ViewSelect({ view, setView, orders = true }) {
  const views = {
    orders: [
      { key: 'buy', label: 'Kupuje' },
      { key: 'sell', label: 'Sprzedaje' },
    ],
    offers: [
      { key: 'oferty', label: 'Oferty naszych handlarzy' },
      { key: 'ofertydc', label: 'Oferty zewnętrzne' },
    ],
  };
  const currentViews = orders ? views.orders : views.offers;
  return (
    <section className="flex">
      {currentViews.map(({ key, label }) => (
        <button
          key={key}
          className={`w-full px-6 py-4 transition-colors  ${
            view === key
              ? 'bg-mainBg border-b-2 border-red-300'
              : 'bg-brighterBg border-b-2 border-gray-700 text-gray-500 hover:text-white'
          }`}
          onClick={() => setView(key)}
        >
          {label}
        </button>
      ))}
    </section>
  );
}
