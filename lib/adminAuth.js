import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

export async function requireAdminAuth(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }
  if (session.user.role !== 'admin') {
    return { redirect: { destination: '/', permanent: false } };
  }
  const safeSession = {
    ...session,
    user: { ...session.user, image: session.user.image ?? null },
  };
  return { props: { session: safeSession } };
}
