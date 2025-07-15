import { useState, useEffect } from 'react';

export default function OfferDetails({
  selectedOffer,
  mode = 'default', // 'default' | 'profile'
  status = 'view', // 'view' | 'edit'
  newOffer,
  handleEdit,
}) {
  const [displayOffer, setDisplayOffer] = useState(selectedOffer);
  const [editableOffer, setEditableOffer] = useState(selectedOffer);

  // Synchronizuj stan z propsami, gdy się zmienią
  useEffect(() => {
    setDisplayOffer(selectedOffer);
    setEditableOffer(selectedOffer);
  }, [selectedOffer]);

  const isEditing = mode === 'profile' && status === 'edit';
  const isViewing =
    (mode === 'profile' && status === 'view') || mode === 'default';

  return (
    <div>
      <h3 className="font-semibold text-white mb-3">Szczegóły oferty</h3>
      <div className="bg-mainBg rounded-lg p-4 mb-4">
        {isEditing ? (
          <textarea
            value={newOffer?.description || ''}
            onChange={(e) => handleEdit('description', e.target.value)}
            placeholder="Wprowadź opis oferty"
            className="w-full bg-brighterBg border border-gray-700 rounded-lg py-2 px-3 text-gray-300 mb-4"
            rows={4}
          />
        ) : (
          <p className="text-gray-300 mb-4">{displayOffer.description}</p>
        )}

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
