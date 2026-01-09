import AdminNav from '@/components/layout/AdminNav';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const DcOffers = () => {
  const [dcOffers, setDcOffers] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchOffers();
  }, []);
  useEffect(() => {
    console.log(dcOffers);
  }, [dcOffers]);

  return (
    <AdminNav>
      <div className="p-6 text-black bg-gray-100">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold mb-6">
            Discord Offers - {dcOffers?.length}
          </h1>
          <button className="bg-red-500 px-4" onClick={handleDeleteAll}>
            delete all
          </button>
        </div>

        {loading ? (
          <p>Ładowanie...</p>
        ) : (
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
                {dcOffers.map((offer) => (
                  <tr key={offer._id} className="hover:bg-gray-50">
                    <td className="p-2 border-b">{offer.thread?.name}</td>
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
                        onClick={() => handleDelete(offer._id)}
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
        )}
      </div>
    </AdminNav>
  );
};

export default DcOffers;
