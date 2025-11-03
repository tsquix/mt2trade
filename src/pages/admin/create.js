import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import axios from 'axios';
import { useRouter } from 'next/router';
import AdminNav from '@/components/layout/AdminNav';
import { requireAdminAuth } from '../../../lib/adminAuth';

export async function getServerSideProps(context) {
  return requireAdminAuth(context);
}

export default function Create() {
  const [serverData, setServerData] = useState({
    name: '',
    slug: '',
    img: '',
    nameAlias: [],
  });
  const [aliasInput, setAliasInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServerData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 🔹 Dodaj name i slug do aliasów dopiero po opuszczeniu pola (onBlur)
  const handleBlur = (field) => {
    setServerData((prev) => {
      const aliases = new Set(prev.nameAlias);
      const value = prev[field]?.trim();

      if (value && !aliases.has(value)) {
        aliases.add(value);
      }

      return { ...prev, nameAlias: Array.from(aliases) };
    });
  };

  // 🔹 Dodaj alias po wpisaniu przecinka
  const handleAliasChange = (e) => {
    const value = e.target.value;

    if (value.includes(',')) {
      const newAlias = value.replace(',', '').trim();
      if (newAlias) {
        setServerData((prev) => ({
          ...prev,
          nameAlias: Array.from(new Set([...prev.nameAlias, newAlias])),
        }));
      }
      setAliasInput('');
    } else {
      setAliasInput(value);
    }
  };

  const handleAliasRemove = (aliasToRemove) => {
    setServerData((prev) => ({
      ...prev,
      nameAlias: prev.nameAlias.filter((a) => a !== aliasToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/server', serverData);
      if (response.data.success) {
        router.push('/marketplace/offers');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminNav>
      <div className="max-w-md mx-auto bg-mainBg p-6 rounded-lg text-white">
        <h1 className="text-2xl font-bold mb-6">Add New Server</h1>

        {error && (
          <div className="bg-red-500 bg-opacity-20 text-red-500 p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Server Name</label>
            <input
              type="text"
              name="name"
              value={serverData.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              className="w-full p-2 bg-brighterBg rounded focus:outline-none"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Slug (URL-friendly name)</label>
            <input
              type="text"
              name="slug"
              value={serverData.slug}
              onChange={handleChange}
              onBlur={() => handleBlur('slug')}
              className="w-full p-2 bg-brighterBg rounded focus:outline-none"
              required
            />
          </div>

          {/* Name Alias Section */}
          <div className="mb-4">
            <label className="block mb-2">Name alias</label>
            <input
              type="text"
              name="alias"
              value={aliasInput}
              onChange={handleAliasChange}
              className="w-full p-2 bg-brighterBg rounded focus:outline-none"
              placeholder="Type alias and press comma"
            />

            {/* Wyświetlanie aliasów */}
            <div className="flex flex-wrap mt-2 gap-2">
              {serverData.nameAlias.map((alias, index) => (
                <span
                  key={index}
                  className="bg-blue-600 px-2 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {alias}
                  <button
                    type="button"
                    onClick={() => handleAliasRemove(alias)}
                    className="text-red-400 hover:text-red-600"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2">Image URL</label>
            <input
              type="text"
              name="img"
              value={serverData.img}
              onChange={handleChange}
              className="w-full p-2 bg-brighterBg rounded focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Server'}
          </button>
        </form>
      </div>
    </AdminNav>
  );
}
