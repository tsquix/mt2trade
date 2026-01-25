export default function ViewSelect({
  view,
  setView,
  orders = true,
  offerCount,
  dcOfferCount,
}) {
  const views = {
    orders: [
      { key: 'buy', label: 'Kupuję' },
      { key: 'sell', label: 'Sprzedaję' },
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
          data-tour={`view-${key === 'ofertydc' ? 'ofertydc' : 'oferty'}`}
          className={`w-full flex group`}
        >
          {!orders && (
            <div
              className={`border py-4 w-[64px] min-w-[64px] text-center ${
                view === key
                  ? 'bg-mainBg border-b-2 border-red-300 text-white'
                  : 'bg-brighterBg border-b-2 border-gray-700 text-gray-500 group-hover:text-white transition-colors'
              }`}
            >
              <p>{offerAmount}</p>
            </div>
          )}

          <div
            //pb-4 pt-[17px] to allign divs cause it has no top border and other div has
            className={`transition-colors w-full px-6 pb-4 pt-[21px] sm:pt-[17px] text-sm tracking-tight  sm:text-base sm:tracking-normal ${
              view === key
                ? 'bg-mainBg border-b-2 border-red-300 text-white'
                : 'bg-brighterBg border-b-2 border-gray-700 text-gray-500 group-hover:text-white '
            }`}
          >
            <span>{label}</span>
          </div>
        </button>
      ))}
    </section>
  );
}
