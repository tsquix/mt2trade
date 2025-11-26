import { authOptions } from '@/pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
const ALLOWED_IPS = ['127.0.0.1', '::1', ''];
export async function requireAdminAuth(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: '/login', permanent: false } };
  }

  const clientIP =
    context.req.headers['x-forwarded-for']?.split(',')[0] ||
    context.req.socket.remoteAddress;
  if (!ALLOWED_IPS.includes(clientIP)) {
    return {
      redirect: { destination: '/', permanent: false },
    };
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
