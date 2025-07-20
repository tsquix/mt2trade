export default function ViewSelect({ view, setView }) {
  const views = [
    {
      key: 'buy',
      label: 'Kupuje',
    },
    {
      key: 'sell',
      label: 'Sprzedaje',
    },
  ];
  return (
    <div className="flex">
      {views.map(({ key, label }) => (
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
    </div>
  );
}
