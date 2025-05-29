export default function OrderCard({ order, deleteOrder, children }) {
  return (
    <>
      <div>
        <p>id {order._id}</p>
        <p>tytul {order.offer.title}</p>
        <p>Buyer: {order?.buyer?.name || 'N/A'}</p>
        <p>Seller: {order?.seller?.name || 'N/A'}</p>
        <p>Server: {order?.offer?.serverName || 'N/A'}</p>
        <p>Amount: {order?.currencyAmount || 0} yang</p>
        <p>Price: {order?.offer?.pricePLN || 0} PLN</p>
        <p>
          Status:{' '}
          <span
            className={
              order?.orderStatus === 'accepted'
                ? 'text-green-300'
                : order?.orderStatus === 'finalized'
                  ? 'text-green-500'
                  : order.orderStatus === 'rejected'
                    ? 'text-red-300'
                    : ''
            }
          >
            {order.orderStatus}
          </span>
        </p>
        {children}
      </div>
      <div>
        <button
          type="button"
          className="text-xl"
          onClick={() => deleteOrder(order._id)}
        >
          X
        </button>
      </div>
    </>
  );
}
