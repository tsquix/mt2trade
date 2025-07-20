import { useOrders } from '@/contexts/OrdersContext';

export function OrderActions({ order }) {
  const { state, actions } = useOrders();
  const { isLoading } = state;
  const { handleStatusChange, handleUpdateOffer } = actions;
  const { orderStatus } = order;

  if (orderStatus === 'pending') {
    return (
      <div className="flex flex-col items-center py-3 px-4  bg-mainBg w-full mb-4">
        <div className="flex gap-4 justify-center rounded-lg bg-[#252525] py-3 w-full">
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
      </div>
    );
  }

  if (orderStatus === 'accepted') {
    return (
      <div className="flex flex-col items-center py-3 px-4  bg-mainBg w-full mb-4">
        <div className="flex gap-4 justify-center rounded-lg bg-[#252525] py-3 w-full ">
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
      </div>
    );
  }

  if (
    orderStatus === 'finalized' &&
    handleUpdateOffer &&
    !order.currencyUpdated
  ) {
    return (
      <div className="flex flex-col items-center py-3 px-4  bg-mainBg w-full mb-4">
        <div className="flex gap-4 justify-center rounded-lg bg-[#252525] py-3 w-full">
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
      </div>
    );
  }
  //w przypadku nie spelnienia zadnego z warunkow
  return null;
}
