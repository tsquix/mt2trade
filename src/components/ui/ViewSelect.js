export default function ViewSelect({
  view,
  setView,
  orders = true,
  offerCount,
  dcOfferCount,
}) {
  const views = {
    orders: [
      { key: 'buy', label: 'Kupuje' },
      { key: 'sell', label: 'Sprzedaje' },
    ],
    offers: [
      {
        key: 'oferty',
        label: 'Oferty naszych handlarzy',
        offerAmount: offerCount,
      },
      {
        key: 'ofertydc',
        label: 'Oferty zewnętrzne',
        offerAmount: dcOfferCount,
      },
    ],
  };

  const currentViews = orders ? views.orders : views.offers;

  return (
    <section className="flex flex-col md:flex-row">
      {currentViews.map(({ key, label, offerAmount }) => (
        <button
          key={key}
          onClick={() => setView(key)}
          className="w-full flex group"
        >
          <div
            className={`border px-6 py-4 w-[64px] min-w-[64px] ${
              view === key
                ? 'bg-mainBg border-b-2 border-red-300 text-white'
                : 'bg-brighterBg border-b-2 border-gray-700 text-gray-500 group-hover:text-white transition-colors'
            }`}
          >
            {offerAmount}
          </div>

          <div
            //pb-4 pt-[17px] to allign divs cause it has no top border and other div has
            className={`transition-colors w-full px-6 pb-4 pt-[17px]  ${
              view === key
                ? 'bg-mainBg border-b-2 border-red-300 text-white'
                : 'bg-brighterBg border-b-2 border-gray-700 text-gray-500 group-hover:text-white'
            }`}
          >
            {label}
          </div>
        </button>
      ))}
    </section>
  );
}
