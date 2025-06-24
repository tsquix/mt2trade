export default function OfferDetails({ selectedOffer }) {
  return (
    <div>
      <h3 className="font-semibold text-white mb-3">Szczegóły oferty</h3>
      <div className="bg-mainBg rounded-lg p-4 mb-4">
        <p className="text-gray-300 mb-4">{selectedOffer.description}</p>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start">
            <svg
              className="text-green-400 mt-1 mr-2 w-4 h-4"
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
              />
            </svg>

            <span>Fast delivery (within 15 minutes)</span>
          </li>
          <li className="flex items-start">
            <svg
              className="text-green-400 mt-1 mr-2 w-4 h-4"
              aria-hidden="true"
              focusable="false"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
            >
              <path
                fill="currentColor"
                d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"
              />
            </svg>

            <span>100% safe transaction method</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
