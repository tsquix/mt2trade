import { useEffect } from 'react';
import Layout from '../layout';
import UserProfile from '@/components/UserProfile';
import { useRouter } from 'next/router';
export default function UserProfilePage() {
  // const { data: session } = useSession();
  const router = useRouter();
  const { username } = router.query;
  const user = {
    name: username,
  };

  return (
    <Layout>
      <UserProfile sessionUser={user} />
    </Layout>
  );
}
