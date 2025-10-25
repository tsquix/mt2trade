import { useSession } from 'next-auth/react';
import Layout from '../../components/layout/Layout';
import UserProfile from '@/components/profile/UserProfile';

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <Layout>
      <UserProfile sessionUser={session?.user} />
    </Layout>
  );
}
