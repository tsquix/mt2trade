import { useEffect } from 'react';
import Layout from '../layout';
import UserProfile from '@/components/UserProfile';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
export default function UserProfilePage() {
  // const { data: session } = useSession();
  const { data: session } = useSession();
  const router = useRouter();
  const { username } = router.query;
  const user = {
    name: username,
  };

  return (
    //TODO zabezpieczyc przed nniepowolana edycja
    <Layout>
      <UserProfile
        sessionUser={user}
        otherUser={session?.user.name === user.name ? false : true}
      />
    </Layout>
  );
}
