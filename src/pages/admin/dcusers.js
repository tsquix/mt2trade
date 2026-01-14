import AdminNav from '@/components/layout/AdminNav';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { requireAdminAuth } from '../../../lib/adminAuth';
import { useFilterByRegex } from '../../../hooks/useFilterByRegex';

export const getServerSideProps = async (context) => {
  return requireAdminAuth(context);
};

export default function DcUsers() {
  const [dcusers, setDcusers] = useState([]);
  const [phrase, setPhrase] = useState('');
  const [debouncedPhrase, setDebouncedPhrase] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOffers, setUserOffers] = useState([]);
  const [sortBy, setSortBy] = useState(null);

  useEffect(() => {
    const fetchDcusers = async () => {
      try {
        const res = await axios.get('/api/admin/dcusers');
        setDcusers(res.data);
      } catch (error) {
        console.error('Failed to fetch dcusers:', error);
      }
    };
    fetchDcusers();
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedPhrase(phrase);
    }, 300);

    return () => clearTimeout(handler);
  }, [phrase]);

  useEffect(() => {
    if (selectedUser) {
      const fetchUserOffers = async () => {
        try {
          const res = await axios.get(
            `/api/dcOffers?owner=${selectedUser.discordId}&limit=5`
          );
          setUserOffers(res.data.data);
        } catch (error) {
          console.error('Failed to fetch user offers:', error);
          setUserOffers([]);
        }
      };
      fetchUserOffers();
    }
  }, [selectedUser]);

  const filteredDcusers = useFilterByRegex(debouncedPhrase, dcusers, [
    'username',
    'displayName',
  ]);

  const sortedDcusers =
    sortBy === 'reputation'
      ? [...filteredDcusers].sort(
          (a, b) => b.reputationScore - a.reputationScore
        )
      : filteredDcusers;

  const handleSortByReputation = () => {
    setSortBy(sortBy === 'reputation' ? null : 'reputation');
  };
  useEffect(() => {
    console.log(sortedDcusers);
  }, [sortedDcusers]);
  return (
    <AdminNav>
      <div className="p-6 text-black bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Discord Users</h1>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Szukaj po Username lub Display Name"
            value={phrase}
            onChange={(e) => setPhrase(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
        <div className="flex justify-between mb-4">
          <button
            className="bg-green-500 px-4 py-2 text-white rounded"
            onClick={handleSortByReputation}
          >
            {sortBy === 'reputation' ? 'Unsort' : 'Sort by Reputation'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 border">Avatar</th>
                <th className="px-3 py-2 border">Username</th>
                <th className="px-3 py-2 border">Display Name</th>
                <th className="px-3 py-2 border">Reputation Score</th>
                <th className="px-3 py-2 border">First Seen</th>
              </tr>
            </thead>
            <tbody>
              {sortedDcusers.map((user) => (
                <tr
                  key={user._id}
                  className="text-center hover:bg-blue-200 cursor-pointer"
                  onClick={() => setSelectedUser(user)}
                >
                  <td className="px-3 py-2 border">
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-10 h-10 rounded-full mx-auto"
                    />
                  </td>
                  <td className="px-3 py-2 border">{user.username}</td>
                  <td className="px-3 py-2 border">{user.displayName}</td>
                  <td className="px-3 py-2 border">{user.reputationScore}</td>
                  <td className="px-3 py-2 border">
                    {new Date(user.stats.firstSeen).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4 max-h-96 overflow-y-auto">
              <h2 className="text-xl font-bold mb-4">
                Szczegóły użytkownika: {selectedUser.username}
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.username}
                    className="w-20 h-20 rounded-full"
                  />
                </div>
                <div>
                  <p>
                    <strong>Discord ID:</strong> {selectedUser.discordId}
                  </p>
                  <p>
                    <strong>Username:</strong> {selectedUser.username}
                  </p>
                  <p>
                    <strong>Display Name:</strong> {selectedUser.displayName}
                  </p>
                  <p>
                    <strong>Account Age:</strong>{' '}
                    {Math.floor(parseInt(selectedUser.accountAge) / 360)} lat
                  </p>
                  <p>
                    <strong>Reputation Score:</strong>{' '}
                    {selectedUser.reputationScore}
                  </p>
                  <p>
                    <strong>First Seen:</strong>{' '}
                    {new Date(
                      selectedUser.stats.firstSeen
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Last Updated:</strong>{' '}
                    {selectedUser.lastUpdated
                      ? new Date(selectedUser.lastUpdated).toLocaleDateString()
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Stats</h3>
                <p>
                  <strong>Total Offers:</strong>{' '}
                  {selectedUser.stats.totalOffers}
                </p>
                <p>
                  <strong>Active Offers:</strong>{' '}
                  {selectedUser.stats.activeOffers}
                </p>
                <p>
                  <strong>Engagement:</strong> {selectedUser.stats.engagement}
                </p>
                <p>
                  <strong>Owner Activity:</strong>{' '}
                  {selectedUser.stats.ownerActivity}
                </p>
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Recent Activity</h3>
                {selectedUser.recentActivity &&
                selectedUser.recentActivity.length > 0 ? (
                  <ul>
                    {selectedUser.recentActivity.map((activity, index) => (
                      <li key={index}>
                        Offer: {activity.title} -{' '}
                        {new Date(activity.date).toLocaleDateString()}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Brak recent activity</p>
                )}
              </div>
              <div className="mt-4">
                <h3 className="text-lg font-semibold">Ostatnie Offers</h3>
                {userOffers.length > 0 ? (
                  <ul>
                    {userOffers.map((offer) => (
                      <li key={offer._id}>
                        {offer.thread?.name} - Status: {offer.status}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>Brak offers</p>
                )}
              </div>
              <button
                onClick={() => setSelectedUser(null)}
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
}
