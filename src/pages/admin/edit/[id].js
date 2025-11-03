import AdminNav from '@/components/layout/AdminNav';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

const EditServer = () => {
  const router = useRouter();
  const { id } = router.query;

  const [server, setServer] = useState({
    name: '',
    slug: '',
    img: '',
    nameAlias: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchServer = async () => {
      try {
        const res = await axios.get(`/api/server?id=${id}`);
        setServer(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Failed to load server:', error);
      }
    };
    fetchServer();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setServer((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.patch(`/api/server?id=${id}`, {
        name: server.name,
        slug: server.slug,
        img: server.img,
        nameAlias: server.nameAlias,
      });
      alert('Server updated successfully!');
      router.push('/admin/servers');
    } catch (error) {
      console.error('Failed to update server:', error);
      alert('Error updating server');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminNav>
        <div className="p-6">Loading...</div>
      </AdminNav>
    );
  }

  return (
    <AdminNav>
      <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl mt-6">
        <h1 className="text-xl font-semibold mb-4">Edit Server</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={server.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              type="text"
              name="slug"
              value={server.slug}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image URL</label>
            <input
              type="text"
              name="img"
              value={server.img}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Name Alias</label>
            <input
              type="text"
              name="nameAlias"
              value={server.nameAlias}
              onChange={(e) =>
                setServer((prev) => ({
                  ...prev,
                  nameAlias: e.target.value.split(',').map((s) => s.trim()),
                }))
              }
              className="w-full border border-gray-300 rounded-lg p-2"
              placeholder="comma,separated,aliases"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </AdminNav>
  );
};

export default EditServer;
