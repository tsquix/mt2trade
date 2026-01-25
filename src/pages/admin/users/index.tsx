import AdminNav from '@/components/layout/AdminNav';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return requireAdminAuth(context);
};

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/admin/users');
        setUsers(res.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const router = useRouter();

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminNav>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-red-400 mb-2">
            Users Management
          </h1>
          <p className="text-gray-200">
            Manage and monitor all registered users
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-400">
            <div className="text-gray-600 text-sm font-medium">Total Users</div>
            <div className="text-3xl font-bold text-gray-800 mt-2">
              {users.length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-400">
            <div className="text-gray-600 text-sm font-medium">Verified</div>
            <div className="text-3xl font-bold text-gray-800 mt-2">
              {users.filter((u) => u.verified).length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-yellow-400">
            <div className="text-gray-600 text-sm font-medium">Admins</div>
            <div className="text-3xl font-bold text-gray-800 mt-2">
              {users.filter((u) => u.role === 'admin').length}
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-400">
            <div className="text-gray-600 text-sm font-medium">
              Total Transactions
            </div>
            <div className="text-3xl font-bold text-gray-800 mt-2">
              {users.reduce((sum, u) => sum + (u.transactionCount || 0), 0)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent outline-none transition-all"
              />
            </div>
            <button className="px-6 py-3 bg-red-400 text-white rounded-lg hover:bg-red-500 transition-colors font-medium">
              🔍 Search
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-400 mx-auto"></div>
              <p className="text-gray-600 mt-4">Loading users...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Transactions
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Rating
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      onClick={() => router.push(`/admin/users/${user._id}`)}
                      className="hover:bg-red-50 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-10 h-10 rounded-full border-2 border-gray-200"
                          />
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.role === 'admin'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <span
                          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.verified
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {user.verified ? '✓ Verified' : '⚠ Unverified'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {user.transactionCount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-yellow-500">⭐</span>
                          <span className="text-sm font-medium text-gray-900">
                            {user.userRating?.toFixed(1) || '0.0'}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({user.ratingCount || 0})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {new Date(user.createdAt).toLocaleDateString(
                            'en-US',
                            {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                            }
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredUsers.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    No users found matching your search.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>
    </AdminNav>
  );
}
