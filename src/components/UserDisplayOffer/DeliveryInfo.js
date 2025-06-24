export default function DeliveryInfo() {
  return (
    <div className="bg-mainBg rounded-lg p-4 mb-6">
      <h4 className="font-medium text-white mb-2">Delivery Information</h4>
      <p className="text-gray-300 text-sm mb-3">
        After purchase, you'll receive instructions on how to meet in-game for
        the Yang transfer. Please have your character name and server ready.
      </p>
      <div className="flex items-center text-yellow-500 bg-yellow-900 bg-opacity-30 rounded-lg p-3">
        <i className="mr-2" data-fa-i2svg="">
          <svg
            className="svg-inline--fa fa-circle-info"
            aria-hidden="true"
            focusable="false"
            data-prefix="fas"
            data-icon="circle-info"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            data-fa-i2svg=""
          >
            <path
              fill="currentColor"
              d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM216 336h24V272H216c-13.3 0-24-10.7-24-24s10.7-24 24-24h48c13.3 0 24 10.7 24 24v88h8c13.3 0 24 10.7 24 24s-10.7 24-24 24H216c-13.3 0-24-10.7-24-24s10.7-24 24-24zm40-208a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
            ></path>
          </svg>
        </i>
        <p className="text-sm text-yellow-300">
          Current estimated delivery time: 10-15 minutes
        </p>
      </div>
    </div>
  );
}
