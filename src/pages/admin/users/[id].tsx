import AdminNav from '@/components/AdminNav';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { requireAdminAuth } from '../../../../lib/adminAuth';
import { GetServerSideProps } from 'next';

interface ExpandableRowProps {
  row: {
    id: string | number;
    [key: string]: any;
  };
  children: React.ReactNode;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return requireAdminAuth(context);
};
export default function UserDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      try {
        const res = await axios.get(`/api/admin/users?userId=${id}`);
        setUserData(res.data.userData);
        setUser(res.data.user);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  useEffect(() => {
    console.log(userData);
  }, [userData]);

  const deleteUser = async function (id: string) {
    if (!id) return;
    await axios.delete(`/api/admin/users?userId=${id}`);
    router.push('/admin/users');
  };

  if (loading)
    return (
      <AdminNav>
        <p>Loading...</p>
      </AdminNav>
    );
  if (!user)
    return (
      <AdminNav>
        <p>User not found</p>
      </AdminNav>
    );

  return (
    <AdminNav>
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <div>
          <button onClick={() => router.push('/admin/users')}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 hover:opacity-45 transition-all hover:scale-110"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
              />
            </svg>
          </button>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center space-x-4">
            <img
              src={user.avatar}
              alt={user.name}
              className="w-20 h-20 rounded-full border shadow"
            />
            <div>
              <h1 className="text-2xl font-bold">{user.name}</h1>
              <p className="text-gray-500">{user.email}</p>
              <p className="text-sm text-gray-400">
                Joined: {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <button onClick={() => deleteUser(user._id)}>
              DELETE ACCOUNT ❌
            </button>
            <button>BAN</button>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-white rounded-xl shadow">
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-bold">{user.role}</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow">
            <p className="text-sm text-gray-500">Verified</p>
            <p className="font-bold">{user.verified ? 'Yes' : 'No'}</p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow">
            <p className="text-sm text-gray-500">Rating</p>
            <p className="font-bold">
              {user.userRating} ⭐ ({user.ratingCount})
            </p>
          </div>
          <div className="p-4 bg-white rounded-xl shadow">
            <p className="text-sm text-gray-500">Transactions</p>
            <p className="font-bold">{user.transactionCount}</p>
          </div>
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">IP History</h2>
          {user.sensData?.ipHistory?.length ? (
            <ul className="list-disc list-inside text-sm">
              {user.sensData.ipHistory.map((ip: string, i: number) => (
                <li key={i}>{ip}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No IPs logged</p>
          )}
        </div>
        <div className="p-4 bg-white rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-2">Login History</h2>
          {user.loginHistory?.length ? (
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="text-left border-b">
                  <th className="p-2">Date</th>
                  <th className="p-2">IP</th>
                  <th className="p-2">Browser</th>
                  <th className="p-2">Location</th>
                  <th className="p-2">Success</th>
                </tr>
              </thead>
              <tbody>
                {user.loginHistory.map((entry: any, i: number) => (
                  <tr key={i} className="border-b hover:bg-gray-50">
                    <td className="p-2">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="p-2">{entry.ip}</td>
                    <td className="p-2">{entry.browser}</td>
                    <td className="p-2">{entry.location || 'unknown'}</td>
                    <td className="p-2">{entry.success ? '✅' : '❌'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-sm">No login history</p>
          )}
        </div>
        <div className="p-4 bg-white rounded-xl shadow space-y-6">
          <h2 className="text-lg font-semibold">Orders & Offers</h2>
          <div>
            <h3 className="font-semibold mb-2">Buy Orders</h3>
            {userData?.buyOrders?.length ? (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">OfferTitle</th>
                    <th className="p-2">Seller</th>
                    <th className="p-2">Buyer</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.buyOrders.map((order: any, i: number) => (
                    <ExpandableRow key={i} row={order}>
                      <td className="p-2">{order.offer?.title || '-'}</td>
                      <td className="p-2">{order.seller?.name || '-'}</td>
                      <td className="p-2">{order.buyer?.name}</td>
                    </ExpandableRow>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-sm">No buy orders</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Sell Orders</h3>
            {userData?.sellOrders?.length ? (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">OfferTitle</th>
                    <th className="p-2">Seller</th>
                    <th className="p-2">Buyer</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.sellOrders.map((order: any, i: number) => (
                    <ExpandableRow key={i} row={order}>
                      <td className="p-2">{order.offer?.title || '-'}</td>
                      <td className="p-2">{order.seller?.name || '-'}</td>
                      <td className="p-2">{order.buyer?.name}</td>
                    </ExpandableRow>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-sm">No sell orders</p>
            )}
          </div>
          <div>
            <h3 className="font-semibold mb-2">Offers</h3>
            {userData?.offers?.length ? (
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="text-left border-b">
                    <th className="p-2">Title</th>
                    <th className="p-2">Server</th>
                    <th className="p-2">sellername</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.offers.map((offer: any, i: number) => (
                    <ExpandableRow key={i} row={offer}>
                      <td className="p-2">{offer.title}</td>
                      <td className="p-2">{offer.serverName}</td>
                      <td className="p-2">{offer.seller.name}</td>
                    </ExpandableRow>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-500 text-sm">No offers</p>
            )}
          </div>
        </div>
      </div>
    </AdminNav>
  );
}
function ExpandableRow({ row, children }: ExpandableRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <tr
        className="border-b hover:bg-gray-50 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {children}
      </tr>
      {open && (
        <tr className="bg-gray-50">
          <td colSpan={6} className="p-4 text-sm text-gray-700">
            <div className="space-y-2">
              <p>
                <span className="font-semibold">ID:</span> {row._id}
              </p>
              {row.seller && (
                <p>
                  <span className="font-semibold">Seller:</span>{' '}
                  {row.seller.name}
                  (Rating: {row.seller.userRating}⭐, Payment:{' '}
                  {row.seller.prefPayment})
                </p>
              )}
              {row.buyer && (
                <p>
                  <span className="font-semibold">Buyer:</span> {row.buyer.name}
                </p>
              )}
              {row.offer && (
                <p>
                  <span className="font-semibold">Offer ID:</span>{' '}
                  {row.offer._id}| {row.offer.serverName} |{' '}
                  {row.offer.currencyAmount} units @ {row.offer.pricePLN} PLN
                </p>
              )}
              {row.timestamp && (
                <p>
                  <span className="font-semibold">Created At:</span>{' '}
                  {new Date(row.timestamp).toLocaleString()}
                </p>
              )}
              {row.orderStatus && (
                <p>
                  <span className="font-semibold">orderStatus</span>{' '}
                  {row.orderStatus}
                </p>
              )}
              {row.rated && (
                <p>
                  <span className="font-semibold">rated</span> {row.rated}
                </p>
              )}
              {row.slug && (
                <p>
                  <span className="font-semibold">slug</span> {row.slug}
                </p>
              )}
              {row.description && (
                <p>
                  <span className="font-semibold">description</span>{' '}
                  {row.description}
                </p>
              )}
              {row.currencyAmount && (
                <p>
                  <span className="font-semibold">currencyAmount</span>{' '}
                  <span className="font-semibold">
                    {row.currencyAmount} kk -
                  </span>{' '}
                  <span className="font-semibold">
                    {row.offer.pricePLN} pln
                  </span>{' '}
                </p>
              )}
              {row.updatedAt && (
                <p>
                  <span className="font-semibold">updatedAt</span>{' '}
                  {new Date(row.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
