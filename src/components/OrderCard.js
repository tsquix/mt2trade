import { useOrders } from '@/contexts/OrdersContext';
import { useState } from 'react';

export default function OrderCard({ order, children }) {
  const { actions } = useOrders();
  const [isHovered, setIsHovered] = useState(false);

  const statusConfig = {
    finalized: {
      width: 'w-full',
      color: 'text-green-500',
      bgColor: 'bg-green-500',
      borderColor: 'border-green-500',
      icon: (
        <svg
          className="w-4 h-4 mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
      text: 'Finalized',
    },
    pending: {
      width: 'w-1/3',
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400',
      borderColor: 'border-yellow-400',
      icon: (
        <svg
          className="w-4 h-4 mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
      text: 'Pending',
    },
    accepted: {
      width: 'w-2/3',
      color: 'text-blue-400',
      bgColor: 'bg-blue-400',
      borderColor: 'border-blue-400',
      icon: (
        <svg
          className="w-4 h-4 mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
      text: 'Accepted',
    },
    rejected: {
      width: 'w-full',
      color: 'text-red-400',
      bgColor: 'bg-red-400',
      borderColor: 'border-red-400',
      icon: (
        <svg
          className="w-4 h-4 mr-1"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          ></path>
        </svg>
      ),
      text: 'Rejected',
    },
  };

  const fallbackStatus = {
    width: 'w-full',
    color: 'text-gray-400',
    bgColor: 'bg-gray-400',
    borderColor: 'border-gray-400',
    icon: (
      <svg
        className="w-4 h-4 mr-1"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        ></path>
      </svg>
    ),
    text: 'Unknown',
  };

  const style = statusConfig[order.orderStatus] || fallbackStatus;
  const pricePerKk = order?.offer?.pricePLN / order?.offer?.currencyAmount || 0;
  const finalPrice = (pricePerKk * order?.currencyAmount || 0).toFixed(2);
  const formattedPricePerKk = pricePerKk.toFixed(2).toString().includes('.00')
    ? pricePerKk.toFixed(0)
    : pricePerKk.toFixed(2);

  return (
    <div
      className="rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl border border-[#333333] hover:border-[#444444]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header */}
      <div className="flex justify-between items-center bg-[#252525] p-4 border-b border-[#333333]">
        <div className="flex items-center space-x-2">
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${style.bgColor} bg-opacity-20`}
          >
            <span className={`${style.color}`}>{style.icon}</span>
          </div>
          <h3 className="font-medium text-lg truncate">
            {order.offer.title || '50M Yang - Fast delivery'}
          </h3>
        </div>
        <div className="flex items-center space-x-3">
          <span
            className={`flex items-center text-sm px-3 py-1 rounded-full ${style.bgColor} bg-opacity-20 ${style.color}`}
          >
            {style.icon}
            {style.text}
          </span>
          <button
            type="button"
            className="text-gray-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-red-400 hover:bg-opacity-10"
            onClick={() => actions.deleteOrder(order._id)}
            aria-label="Delete order"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 bg-mainBg">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          {/* Order Details */}
          <div className="space-y-3 flex-grow">
            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#333333] text-gray-400 mr-3">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 640 512"
                >
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c10 0 18.8-4.9 24.2-12.5l-99.2-99.2c-14.9-14.9-23.3-35.1-23.3-56.1v-33c-15.9-4.7-32.8-7.2-50.3-7.2H178.3zM384 224c-17.7 0-32 14.3-32 32v82.7c0 17 6.7 33.3 18.7 45.3L478.1 491.3c18.7 18.7 49.1 18.7 67.9 0l73.4-73.4c18.7-18.7 18.7-49.1 0-67.9L512 242.7c-12-12-28.3-18.7-45.3-18.7H384zm24 80a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"></path>
                </svg>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Seller</span>
                <p className="font-medium">{order?.seller?.name || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#333333] text-gray-400 mr-3">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 448 512"
                >
                  <path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"></path>
                </svg>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Buyer</span>
                <p className="font-medium">{order?.buyer?.name || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-center">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#333333] text-gray-400 mr-3">
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 512 512"
                >
                  <path d="M64 32C28.7 32 0 60.7 0 96v64c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm48 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zM64 288c-35.3 0-64 28.7-64 64v64c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V352c0-35.3-28.7-64-64-64H64zm280 72a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm56 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z"></path>
                </svg>
              </div>
              <div>
                <span className="text-gray-400 text-sm">Server</span>
                <p className="font-medium">
                  {order?.offer.serverName || 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Price Card */}
          <div className="bg-[#1e1e1e] rounded-lg p-4 shadow-inner border border-[#333333] min-w-[180px] transform transition-all duration-300 hover:scale-105">
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-400 mb-1">Amount</span>
              <div className="text-2xl font-bold text-white mb-2">
                {order?.currencyAmount || 0} <span className="text-sm">kk</span>
              </div>

              <div
                className={`w-full h-px ${style.bgColor} opacity-30 my-2`}
              ></div>

              <div className="text-accent font-bold text-lg">
                {finalPrice} PLN
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {formattedPricePerKk} zł per 1kk
              </div>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">Order Progress</span>
            <span
              className={`text-sm ${style.color} font-medium flex items-center`}
            >
              {style.icon} {style.text}
            </span>
          </div>
          <div className="w-full bg-[#252525] rounded-full h-2 overflow-hidden">
            <div
              className={`h-2 rounded-full ${style.bgColor} ${style.width} transition-all duration-500`}
            ></div>
          </div>
        </div>

        {/* Commented out section for finalized orders */}
      </div>

      {children}
    </div>
  );
}
