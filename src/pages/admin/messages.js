import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import axios from 'axios';
import Image from 'next/image';
import AdminNav from '@/components/layout/AdminNav';
import { requireAdminAuth } from '../../../lib/adminAuth';

export async function getServerSideProps(context) {
  return requireAdminAuth(context);
}
export default function Messages() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchMessages();
  }, []);

  // useEffect(() => {
  //   console.log(messages);
  // }, [messages]);

  const fetchMessages = async () => {
    const res = await axios.get('/api/messages');
    setMessages(res.data.data);
  };

  const deleteMessage = async function (msgId) {
    try {
      await axios.delete(`/api/messages?msgId=${msgId}`);
    } catch (err) {
      console.error('Error deleting order:', err);
    } finally {
      await fetchMessages();
    }
  };

  return (
    <AdminNav>
      <div>
        <h1 className="text-2xl font-semibold mb-6">Wiadomosci</h1>
        {messages.length > 0
          ? messages.map((msg) => (
              <div
                key={msg._id}
                className="bg-white dark:bg-zinc-900 shadow-md rounded-xl p-6 mb-8 border border-zinc-200 dark:border-zinc-700 relative"
              >
                <div className="absolute right-5 text-red-300 text-xl">
                  <button onClick={() => deleteMessage(msg._id)}>X</button>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-zinc-500">
                    Data Wysłania:{' '}
                    <span className="text-zinc-900 dark:text-zinc-100">
                      {new Date(msg.createdAt).toLocaleString()}
                    </span>
                  </p>
                </div>

                <div className="text-sm text-zinc-700 dark:text-zinc-200">
                  <p>
                    <span className="font-semibold">Email:</span>{' '}
                    {msg.email || 'Nieznany'}
                  </p>
                  <p>
                    <span className="font-semibold">Temat:</span>{' '}
                    {msg.topic || 'Nieznany'}
                  </p>
                  <p>
                    <span className="font-semibold">Wiadomosc:</span>{' '}
                    {msg.message || 'Nieznany'}
                  </p>
                </div>
              </div>
            ))
          : 'nie ma zadnych wiadomosci'}
      </div>
    </AdminNav>
  );
}
