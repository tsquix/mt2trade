export default function ViewSelect({ onViewChange, view }) {
  const views = [
    {
      key: 'buy',
      label: 'kupuje',
    },
    {
      key: 'sell',
      label: 'sprzedaje',
    },
    {
      key: 'offers',
      label: 'moje oferty',
    },
  ];
  return (
    <div>
      {views.map(({ key, label }) => (
        <button
          key={key}
          className={`bg-mainBg px-2 py-1 transition-colors ${
            view === key ? 'bg-red-300' : 'hover:bg-red-200'
          }`}
          onClick={() => onViewChange(key)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
