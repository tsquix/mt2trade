export function OrderActions({
  order,
  handleStatusChange,
  handleUpdateOffer,
  isLoading,
}) {
  const { orderStatus } = order;

  if (orderStatus === 'pending') {
    return (
      <div className="flex gap-4 mt-4">
        <button
          onClick={() => handleStatusChange('accepted', order._id)}
          className={`bg-mainBg px-4 py-2 rounded-lg hover:opacity-50 transition ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isLoading}
        >
          Akceptuj
        </button>
        <button
          onClick={() => handleStatusChange('rejected', order._id)}
          disabled={isLoading}
          className={`bg-red-100 text-mainBg px-4 py-2 rounded-lg hover:opacity-70 transition ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Odrzuć
        </button>
      </div>
    );
  }

  if (orderStatus === 'accepted') {
    return (
      <div className="flex gap-4 mt-4">
        <button
          disabled={isLoading}
          className={`bg-red-100 text-mainBg px-4 py-2 rounded-lg hover:opacity-70 transition ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => handleStatusChange('finalized', order._id)}
        >
          Transakcja zakończona
        </button>
        <button
          onClick={() => handleStatusChange('rejected', order._id)}
          disabled={isLoading}
          className={`bg-red-100 text-mainBg px-4 py-2 rounded-lg hover:opacity-70 transition ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          Coś poszło nie tak, odrzuć
        </button>
      </div>
    );
  }

  if (
    orderStatus === 'finalized' &&
    handleUpdateOffer &&
    !order.currencyUpdated
  ) {
    return (
      <div className="mt-4">
        <button
          disabled={isLoading}
          className={`bg-red-100 text-mainBg px-4 py-2 rounded-lg hover:opacity-70 transition ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          onClick={() => {
            handleUpdateOffer(order);
            order.currencyUpdated = true;
          }}
        >
          Odejmij od oferty sprzedaną ilość waluty
        </button>
      </div>
    );
  }
  //w przypadku nie spelnienia zadnego z warunkow
  return null;
}
