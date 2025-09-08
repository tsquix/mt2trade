import NextAuth, { getServerSession } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import User, { IUser } from '../../../../models/User';
import connectMongoDB from '../../../../lib/mongoose';
import axios from 'axios';
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

async function isAdminEmail(email: string) {
  await connectMongoDB();
  const user = await User.findOne({ email });
  return user?.role === 'admin';
}
export async function isAdminRequest(req, res) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user?.email) {
    res.status(401).json({ message: 'Nie jesteś zalogowany' });
    throw new Error('Nie jesteś zalogowany');
  }

  const isAdmin = await isAdminEmail(session.user.email);
  if (!isAdmin) {
    res.status(403).json({ message: 'Brak dostępu, tylko admin' });
    throw new Error('Nie jest adminem');
  }
}
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) return null;

        await connectMongoDB();
        const user = await User.findOne({ email: credentials.email });

        const ip =
          req.headers['x-forwarded-for']?.toString().split(',')[0] ||
          req.socket.remoteAddress;
        const browser = req.headers['user-agent'] || 'unknown';
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || 'user';
      }
      return token;
    },
    async session({ session, token }) {
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

export default (req, res) => NextAuth(req, res, authOptions);
