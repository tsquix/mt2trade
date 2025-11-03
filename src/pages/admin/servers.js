import AdminNav from '@/components/layout/AdminNav';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const Servers = () => {
  const [servers, setServers] = useState([]);
  const [editingServer, setEditingServer] = useState(null);
  const [newAlias, setNewAlias] = useState('');
  const router = useRouter();

  const fetchServers = async () => {
    try {
      const res = await axios.get('/api/server');
      setServers(res.data.data);
    } catch (error) {
      console.error('Failed to fetch servers:', error);
    }
  };

  useEffect(() => {
    fetchServers();
  }, []);
  useEffect(() => {
    console.log(servers);
  }, [servers]);

  const handleEdit = (id) => {
    router.push(`/admin/edit/${id}`);
  };

  const handleAliasAdd = async () => {
    if (!newAlias.trim()) return;
    const updatedAliases = [
      ...(editingServer.nameAlias || []),
      newAlias.trim(),
    ];

    await axios.patch(`/api/server?id=${editingServer._id}`, {
      nameAlias: updatedAliases,
    });

    setNewAlias('');
    setEditingServer(null);
    fetchServers();
  };

  const handleAliasRemove = async (aliasToRemove) => {
    const updatedAliases = editingServer.nameAlias.filter(
      (a) => a !== aliasToRemove
    );

    await axios.patch(`/api/server?id=${editingServer._id}`, {
      nameAlias: updatedAliases,
    });

    setEditingServer(null);
    fetchServers();
  };

  return (
    <AdminNav>
      <div className="p-6 text-black">
        <h1 className="text-2xl font-semibold mb-4">Servers</h1>

        {servers.length === 0 ? (
          <p className="text-gray-500">No servers found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {servers.map((server) => (
              <div
                key={server._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col justify-between hover:shadow-md transition"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    {server.img && (
                      <img
                        src={server.img}
                        alt={server.name}
                        className="w-12 h-12 object-contain rounded-md"
                      />
                    )}
                    <h2 className="text-lg font-semibold">{server.name}</h2>
                  </div>

                  <p className="text-sm text-gray-500 mb-2">
                    Slug: {server.slug}
                  </p>

                  {server.nameAlias?.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-gray-600 mb-1">
                        Aliases:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {server.nameAlias.map((alias) => (
                          <span
                            key={alias}
                            className="bg-gray-100 border border-gray-200 px-2 py-1 text-xs rounded-md"
                          >
                            {alias}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(server._id)}
                    className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => setEditingServer(server)}
                    className="flex-1 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition"
                  >
                    Aliases
                  </button>
                </div>
              </div>
            ))}

            {/* Card z plusikiem */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-4 flex flex-col justify-center items-center hover:shadow-md transition">
              <Link href="/admin/create" className="items-center text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="size-28 hover:scale-110 transition-all"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4.5v15m7.5-7.5h-15"
                  />
                </svg>
              </Link>
            </div>
          </div>
        )}

        {/* Modal do edycji aliasów */}
        {editingServer && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg">
              <h2 className="text-lg font-semibold mb-4">
                Edit Aliases for {editingServer.name}
              </h2>

              <div className="flex flex-wrap gap-2 mb-4">
                {editingServer.nameAlias?.length ? (
                  editingServer.nameAlias.map((alias) => (
                    <div
                      key={alias}
                      className="flex items-center bg-gray-100 px-2 py-1 rounded-md text-sm"
                    >
                      <span>{alias}</span>
                      <button
                        onClick={() => handleAliasRemove(alias)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No nameAlias yet.</p>
                )}
              </div>

              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={newAlias}
                  onChange={(e) => setNewAlias(e.target.value)}
                  placeholder="Add new alias"
                  className="flex-1 border border-gray-300 rounded-lg p-2 text-sm"
                />
                <button
                  onClick={handleAliasAdd}
                  className="bg-blue-600 text-white px-3 rounded-lg text-sm hover:bg-blue-700 transition"
                >
                  Add
                </button>
              </div>

              <button
                onClick={() => setEditingServer(null)}
                className="w-full mt-2 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminNav>
  );
};

export default Servers;
