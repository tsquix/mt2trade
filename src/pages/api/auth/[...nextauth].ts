import NextAuth, { getServerSession, NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User, { IUser } from '../../../../models/User';
import connectMongoDB from '../../../../lib/mongoose';
import axios from 'axios';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';
import { JWT } from 'next-auth/jwt';
import { RequestInternal } from 'next-auth';
import { ratelimit } from '../../../../lib/ratelimit';
declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
  }
}
declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string;
      email?: string;
      role?: string;
    };
  }
}
async function getGeo(ip: string) {
  try {
    const url = `http://ip-api.com/json/${ip}?fields=status,country,regionName,city,timezone`;
    const res = await axios.get(url);
    if (res.data.status === 'success') {
      return {
        country: res.data.country,
        region: res.data.regionName,
        city: res.data.city,
        timezone: res.data.timezone,
      };
    }
    return null;
  } catch (error) {
    console.error('Geolocation fetch error:', error);
    return null;
  }
}
const ALLOWED_IPS = [
  '::1', // localhost IPv6
  '127.0.0.1', // localhost IPv4
];

async function isAdminEmail(email: string) {
  await connectMongoDB();
  const user = await User.findOne({ email });
  return user?.role === 'admin';
}
function getClientIP(req: NextApiRequest) {
  return (
    req.headers['x-forwarded-for']?.toString().split(',')[0].trim() ||
    req.socket.remoteAddress ||
    ''
  );
}
export async function isAdminRequest(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const clientIP = getClientIP(req);

  // 1. Rate limit
  // const { success } = await ratelimit.limit(clientIP);
  // if (!success) return res.status(429).json({ message: 'Too many requests' });

  // 2. IP whitelist
  if (!ALLOWED_IPS.includes(clientIP))
    return res.status(403).json({ message: 'IP nie ma dostępu' });

  // 3. Sesja
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email)
    return res.status(401).json({ message: 'Nie jesteś zalogowany' });

  // 4. Rola admin
  const isAdmin = await isAdminEmail(session.user.email);
  if (!isAdmin)
    return res.status(403).json({ message: 'Brak dostępu, tylko admin' });
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        // Type assertion to access the properties we need
        const reqWithSocket = req as RequestInternal & {
          socket?: { remoteAddress?: string };
        };

        if (!credentials?.email || !credentials?.password) return null;

        await connectMongoDB();
        const user = await User.findOne({ email: credentials.email });

        const ip =
          reqWithSocket.headers && reqWithSocket.headers['x-forwarded-for']
            ? reqWithSocket.headers['x-forwarded-for'].toString().split(',')[0]
            : reqWithSocket.socket?.remoteAddress;
        const browser = reqWithSocket.headers
          ? reqWithSocket.headers['user-agent'] || 'unknown'
          : 'unknown';
        const timestamp = new Date();

        // Check if login succeeds
        const isPasswordValid = user
          ? await bcrypt.compare(credentials.password, user.password)
          : false;

        // Initialize loginHistory
        if (user && !user.loginHistory) user.loginHistory = [];

        // Push login attempt
        const geo = await getGeo(ip);
        if (user) {
          user.loginHistory.push({
            ip,
            browser,
            timestamp,
            success: isPasswordValid,
            location: geo
              ? `${geo.city}, ${geo.region}, ${geo.country}`
              : 'unknown',
          });

          if (user.loginHistory.length > 50) user.loginHistory.shift();

          // Track unique IPs
          if (!user.sensData?.ipHistory) user.sensData = { ipHistory: [] };
          if (ip && !user.sensData.ipHistory.includes(ip)) {
            user.sensData.ipHistory.push(ip);
          }

          await user.save();
        }

        if (isPasswordValid && user) {
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      if (session?.user) {
        session.user.id = token.id;
        session.user.role = token.role || 'user';
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

export default (req: NextApiRequest, res: NextApiResponse) =>
  NextAuth(req, res, authOptions);
