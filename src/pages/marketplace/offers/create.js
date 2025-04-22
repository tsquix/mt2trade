import Layout from '@/pages/layout';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { fetchServerList } from '../../../../lib/fetchServers';

export default function Create({ servers }) {
  const { data: session } = useSession();
  const router = useRouter();
  const { server } = router.query;
  const [newOffer, setNewOffer] = useState({
    seller: session?.user.id,
    serverName: server || '',
    title: '', // Add title field
    currencyAmount: '',
    currencyType: 'PLN',
    pricePLN: '',
    description: '',
  });

  useEffect(() => {
    if (server) {
      setNewOffer((prev) => ({
        ...prev,
        serverName: server,
      }));
    }
  }, [server]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewOffer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  async function createOffer(e) {
    e.preventDefault();
    try {
      const response = await axios.post(`/api/offer`, newOffer);
      if (response.data.success) {
        router.push('/marketplace/offers'); // Redirect after success
      }
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto p-6 bg-mainBg">
        <h1 className="text-2xl font-bold mb-6">Create New Offer</h1>
        <form onSubmit={createOffer} className="space-y-4">
          <div>
            <label className="block mb-2">Server Name</label>
            <select
              name="serverName"
              value={newOffer.serverName}
              onChange={handleChange}
              className="w-full p-2 bg-brighterBg rounded-lg"
              required
            >
              <option value="">Select Server</option>
              {servers.map((server) => (
                <option key={server._id} value={server.name}>
                  {server.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add Title input field */}
          <div>
            <label className="block mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={newOffer.title}
              onChange={handleChange}
              className="w-full p-2 bg-brighterBg rounded-lg"
              required
              placeholder="Enter offer title"
            />
          </div>

          <div>
            <label className="block mb-2">Amount</label>
            <input
              type="number"
              name="currencyAmount"
              value={newOffer.currencyAmount}
              onChange={handleChange}
              className="w-full p-2 bg-brighterBg rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Price (PLN)</label>
            <input
              type="number"
              name="pricePLN"
              value={newOffer.pricePLN}
              onChange={handleChange}
              className="w-full p-2 bg-brighterBg rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block mb-2">Description</label>
            <textarea
              name="description"
              value={newOffer.description}
              onChange={handleChange}
              className="w-full p-2 bg-brighterBg rounded-lg"
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-white hover:bg-gray-300 text-black font-bold py-2 px-4 rounded-lg"
          >
            Create Offer
          </button>
        </form>
      </div>
    </Layout>
  );
}
export async function getStaticProps() {
  const baseUrl = process.env.NEXTAUTH_URL;
  const servers = await fetchServerList(baseUrl);
  return { props: { servers }, revalidate: 86400 };
}
