import { useState } from 'react';
import Layout from '../layout';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Create() {
  const [serverData, setServerData] = useState({
    name: '',
    slug: '',
    img: '',
  });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/server', serverData);
      if (response.data.success) {
        router.push('/marketplace/offers'); // Redirect to servers list
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to add server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-md mx-auto bg-mainBg p-6 rounded-lg">
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
              className="w-full p-2 bg-brighterBg rounded focus:outline-none"
              required
            />
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
    </Layout>
  );
}
