import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]';
import { useEffect } from 'react';
import Link from 'next/link';
import AdminNav from '../../components/AdminNav';
import { requireAdminAuth } from '../../../lib/adminAuth';

export async function getServerSideProps(context) {
  return requireAdminAuth(context);
}
export default function AdminPage() {
  return (
    <AdminNav>
      <div>panel</div>
    </AdminNav>
  );
}
