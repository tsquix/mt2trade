export default function OrderCard({ order, deleteOrder, children, buyOrder }) {
  const statusStyles = {
    finalized: {
      width: 'w-full',
      color: 'text-green-500',
      bgColor: 'bg-green-900',
      text: 'Finalized',
    },
    pending: {
      width: 'w-1/3',
      color: 'text-yellow-100',
      bgColor: 'bg-yellow-600',
      text: 'Pending',
    },
    accepted: {
      width: 'w-2/3',
      color: 'text-green-100',
      bgColor: 'bg-green-500',
      text: 'Accepted',
    },
    rejected: {
      width: 'w-full',
      color: 'text-white',
      bgColor: 'bg-red-300',
      text: 'Rejected',
    },
  };

  const fallbackStatus = {
    width: 'w-full',
    color: 'bg-gray-300',
    text: 'Unknown',
  };
  const style = statusStyles[order.orderStatus] || fallbackStatus;

  return (
    <>
      <div>
        <div className="flex justify-between items-center bg-[#252525] p-3">
          <div className="flex items-center">
            <span
              className={`w-2 h-2 rounded-full mr-2  ${style.bgColor}`}
            ></span>
            <p> {order.offer.title || '50M Yang - Fast delivery'}</p>
          </div>
          <div className="flex items-center">
            <span
              className={` text-xs px-2 py-0.5 rounded-full mr-2 ${style.bgColor} ${style.color} `}
            >
              {style.text}
            </span>
            <button
              type="button"
              className="text-gray-400 hover:text-red-400 transition-colors"
              onClick={() => deleteOrder(order._id)}
            >
              X
            </button>
          </div>
        </div>
        <div className="p-4 bg-mainBg">
          <div className="flex flex-col md:flex-row justify-between mb-4">
            <div className="space-y-2 mb-4 md:mb-0">
              <div className="flex items-center">
                <div className="w-6 text-gray-400">
                  <i data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-user-tag"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="user-tag"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 640 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c10 0 18.8-4.9 24.2-12.5l-99.2-99.2c-14.9-14.9-23.3-35.1-23.3-56.1v-33c-15.9-4.7-32.8-7.2-50.3-7.2H178.3zM384 224c-17.7 0-32 14.3-32 32v82.7c0 17 6.7 33.3 18.7 45.3L478.1 491.3c18.7 18.7 49.1 18.7 67.9 0l73.4-73.4c18.7-18.7 18.7-49.1 0-67.9L512 242.7c-12-12-28.3-18.7-45.3-18.7H384zm24 80a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"
                      ></path>
                    </svg>
                  </i>
                </div>{' '}
                <span className="text-gray-400 mr-2">Seller:</span>
                <span className="font-medium">
                  {order?.seller?.name || 'N/A'}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-6 text-gray-400">
                  <i data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-user"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="user"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 448 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"
                      ></path>
                    </svg>
                  </i>
                </div>
                <span className="text-gray-400 mr-2">Buyer:</span>
                <span className="font-medium">
                  {order?.buyer?.name || 'N/A'}
                </span>
              </div>
              <div className="flex items-center">
                <div className="w-6 text-gray-400">
                  <i data-fa-i2svg="">
                    <svg
                      className="svg-inline--fa fa-server"
                      aria-hidden="true"
                      focusable="false"
                      data-prefix="fas"
                      data-icon="server"
                      role="img"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 512 512"
                      data-fa-i2svg=""
                    >
                      <path
                        fill="currentColor"
                        d="M64 32C28.7 32 0 60.7 0 96v64c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm48 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM64 288c-35.3 0-64 28.7-64 64v64c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V352c0-35.3-28.7-64-64-64H64zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"
                      ></path>
                    </svg>
                  </i>
                </div>
                <span className="text-gray-400 mr-2">Server:</span>
                <span className="font-medium">{order?.offer.serverName}</span>
              </div>
            </div>

            <div className="bg-[#252525] rounded-lg p-3 text-center">
              <div className="text-sm text-gray-400">Amount</div>
              <div className="text-xl font-bold text-white">
                {order?.currencyAmount || 0} <span className="text-sm">kk</span>
              </div>
              <div className="text-accent font-bold mt-1">
                {' '}
                Final price:{' '}
                {(
                  (order?.offer?.pricePLN / order?.offer?.currencyAmount) *
                  order?.currencyAmount
                ).toFixed(2)}
                PLN
              </div>
              <div className="text-xs text-gray-400">
                {(order?.offer?.pricePLN / order?.offer?.currencyAmount)
                  .toFixed(2)
                  .toString()
                  .includes('.00')
                  ? (
                      order?.offer?.pricePLN / order?.offer?.currencyAmount
                    ).toFixed(0)
                  : (
                      order?.offer?.pricePLN / order?.offer?.currencyAmount
                    ).toFixed(2)}{' '}
                zł za 1kk
              </div>
            </div>
          </div>
          <div className="flex w-full items-center justify-center">
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
          </div>
          <div className="w-full bg-[#252525] rounded-full h-2 mb-4">
            {}
            <div
              className={`h-2 rounded-full ${style.bgColor} ${style.width}`}
            ></div>
          </div>
          {/* {order.orderStatus === 'finalized' && buyOrder && (
            <div class="bg-[#252525] rounded-lg p-3">
              <p class="text-sm text-center mb-3">
                Czy transakcja przebiegła pomyślnie?
              </p>
              <div class="flex space-x-2">
                <button class="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg transition-colors duration-200">
                  Tak
                </button>
                <button class="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition-colors duration-200">
                  Nie
                </button>
              </div>
            </div>
          )} */}
        </div>

        {/* <p>id {order._id}</p> */}

        {children}
      </div>
    </>
  );
}
