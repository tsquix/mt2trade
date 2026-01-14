import AdminNav from '@/components/layout/AdminNav';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useFilterByRegex } from '../../../hooks/useFilterByRegex';

const DcOffers = () => {
  const [dcOffers, setDcOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [phrase, setPhrase] = useState('');
  const [debouncedPhrase, setDebouncedPhrase] = useState('');

  const fetchOffers = async () => {
    setLoading(true);
    const res = await axios.get('/api/dcOffers');
    setDcOffers(res.data.data);
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Na pewno chcesz usunąć tę ofertę?')) return;
    await axios.delete(`/api/dcOffers?id=${id}`);
    fetchOffers();
  };
  const handleDeleteAll = async () => {
    if (!confirm('Na pewno chcesz wszystkie oferty ???????')) return;
    await axios.delete(`/api/dcOffers?id=all`);
    fetchOffers();
  };

  const handleStatusChange = async (id, newStatus) => {
    await axios.patch(`/api/dcOffers?id=${id}`, { status: newStatus });
    fetchOffers();
  };
  const handleBackup = () => {
    const dataStr = JSON.stringify(dcOffers, null, 2);
    const dataUri =
      'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const exportFileDefaultName = 'dcOffers_backup.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };
  const handleSortByServer = () => {
    setSortBy(sortBy === 'server' ? null : 'server');
  };
  const handleRowClick = (offer) => {
    setSelectedOffer(offer);
  };
  const closeModal = () => {
    setSelectedOffer(null);
  };
  useEffect(() => {
    fetchOffers();
  }, []);
  useEffect(() => {
    console.log(dcOffers);
  }, [dcOffers]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPhrase(phrase);
    }, 300);

    return () => clearTimeout(handler);
  }, [phrase]);

  const filteredOffers = useFilterByRegex(debouncedPhrase, dcOffers, [
    'thread.name',
    'thread.owner.displayName',
    'thread.owner.name',
  ]);

  const sortedOffers =
    sortBy === 'server'
      ? [...filteredOffers].sort((a, b) => {
          if (!a.serverName && b.serverName) return 1;
          if (a.serverName && !b.serverName) return -1;
          if (a.serverName && b.serverName)
            return a.serverName.localeCompare(b.serverName);
          return 0;
        })
      : filteredOffers;

  return (
    <AdminNav>
      <div className="p-6 text-black bg-gray-100">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-6">
            Discord Offers - {dcOffers?.length}
          </h1>
          <div className="flex space-x-2">
            <button
              className="bg-green-500 px-4 py-2 text-white rounded"
              onClick={handleSortByServer}
            >
              {sortBy === 'server' ? 'Unsort' : 'Sort by Server'}
            </button>
            <button
              className="bg-blue-500 px-4 py-2 text-white rounded"
              onClick={handleBackup}
            >
              Backup All
            </button>
            <button
              className="bg-red-500 px-4 py-2 text-white rounded"
              onClick={handleDeleteAll}
            >
              delete all
            </button>
          </div>
        </div>

        {loading ? (
          <p>Ładowanie...</p>
        ) : (
          <div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Szukaj po nazwie wątku lub właścicielu"
                value={phrase}
                onChange={(e) => setPhrase(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded"
              />
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 text-sm">
                <thead className="bg-gray-100 text-left">
                  <tr>
                    <th className="p-2 border-b">Nazwa wątku</th>
                    <th className="p-2 border-b">Właściciel</th>
                    <th className="p-2 border-b">Serwer</th>
                    <th className="p-2 border-b">Status</th>
                    <th className="p-2 border-b">Akcje</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedOffers.map((offer) => (
                    <tr
                      key={offer._id}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td
                        className="p-2 border-b"
                        onClick={() => handleRowClick(offer)}
                      >
                        {offer.thread?.name}
                      </td>
                      <td className="p-2 border-b">
                        {offer.thread?.owner?.displayName ||
                          offer.thread?.owner?.name}
                      </td>
                      <td className="p-2 border-b">{offer.serverName}</td>

                      <td className="p-2 border-b">
                        <select
                          className="border rounded p-1"
                          value={offer.status}
                          onChange={(e) =>
                            handleStatusChange(offer._id, e.target.value)
                          }
                        >
                          <option value="active">Active</option>
                          <option value="sold">Sold</option>
                          <option value="closed">Closed</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="p-2 border-b">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(offer._id);
                          }}
                          className="text-red-600 hover:underline"
                        >
                          Usuń
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedOffer && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-2xl w-full mx-4 max-h-96 overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">Starter Message</h2>
              <p className="whitespace-pre-wrap">
                {selectedOffer.starterMessage?.content ||
                  'Brak wiadomości startowej'}
              </p>
              <button
                onClick={closeModal}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              >
                Zamknij
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminNav>
  );
};

export default DcOffers;
