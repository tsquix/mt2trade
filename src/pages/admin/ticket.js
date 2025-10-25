import { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import axios from 'axios';
import Image from 'next/image';
import AdminNav from '@/components/layout/AdminNav';
import { requireAdminAuth } from '../../../lib/adminAuth';

export async function getServerSideProps(context) {
  return requireAdminAuth(context);
}
export default function Ticket() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    const res = await axios.get('/api/ticket');
    setTickets(res.data.data);
  };
  const deleteTicket = async function (ticketId) {
    try {
      await axios.delete(`/api/ticket?ticketId=${ticketId}`);
    } catch (err) {
      console.error('Error deleting order:', err);
    } finally {
      await fetchTickets();
    }
  };

  return (
    <AdminNav>
      <div>
        <h1 className="text-2xl font-semibold mb-6">Zgłoszenia</h1>
        {tickets.map((ticket) => (
          <div
            key={ticket._id}
            className="bg-white dark:bg-zinc-900 shadow-md rounded-xl p-6 mb-8 border border-zinc-200 dark:border-zinc-700 relative"
          >
            <div className="absolute right-5 text-red-300 text-xl">
              <button onClick={() => deleteTicket(ticket._id)}>X</button>
            </div>
            <div className="mb-4">
              <p className="text-sm text-zinc-500">
                Data zgłoszenia:{' '}
                <span className="text-zinc-900 dark:text-zinc-100">
                  {new Date(ticket.createdAt).toLocaleString()}
                </span>
              </p>
              <p className="mt-2 text-zinc-800 dark:text-zinc-100">
                <span className="font-semibold">Opis:</span>{' '}
                {ticket.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
              {ticket.images.map((image) => (
                <div
                  key={image}
                  className="relative w-40 h-40 rounded-lg border"
                >
                  <Image
                    src={image}
                    alt="ticket image"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="text-sm text-zinc-700 dark:text-zinc-200">
              <p>
                <span className="font-semibold">Zgłaszający:</span>{' '}
                {ticket.buyOrder?.buyer?.name || 'Nieznany'}
              </p>
              <p>
                <span className="font-semibold">Zgłoszony:</span>{' '}
                {ticket.buyOrder?.seller?.name || 'Nieznany'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </AdminNav>
  );
}
