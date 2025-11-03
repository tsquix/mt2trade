import AdminNav from '@/components/layout/AdminNav';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  return requireAdminAuth(context);
};

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/api/admin/users');
        setUsers(res.data);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  const router = useRouter();
  return (
    <AdminNav>
      <div className="p-6 text-black bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Users</h1>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 border">Avatar</th>
                <th className="px-3 py-2 border">Name</th>
                <th className="px-3 py-2 border">Email</th>
                <th className="px-3 py-2 border">Role</th>
                <th className="px-3 py-2 border">Verified</th>
                <th className="px-3 py-2 border">Transactions</th>
                <th className="px-3 py-2 border">Rating</th>
                <th className="px-3 py-2 border">Created At</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="text-center hover:bg-blue-200"
                  onClick={() => router.push(`/admin/users/${user._id}`)}
                >
                  <td className="px-3 py-2 border">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-full mx-auto"
                    />
                  </td>
                  <td className="px-3 py-2 border">{user.name}</td>
                  <td className="px-3 py-2 border">{user.email}</td>
                  <td className="px-3 py-2 border">{user.role}</td>
                  <td className="px-3 py-2 border">
                    {user.verified ? '✅' : '❌'}
                  </td>
                  <td className="px-3 py-2 border">{user.transactionCount}</td>
                  <td className="px-3 py-2 border">
                    {user.userRating} ({user.ratingCount})
                  </td>
                  <td className="px-3 py-2 border">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminNav>
  );
}
