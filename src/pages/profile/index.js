import { useSession } from 'next-auth/react';
import Layout from '../layout';
import UserProfile from '@/components/UserProfile';

export default function ProfilePage() {
  const { data: session } = useSession();

  return (
    <Layout>
      <UserProfile sessionUser={session?.user} />
    </Layout>
  );
}
