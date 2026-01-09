import { getServerSession } from 'next-auth';
import connectMongoDB from '../../../../lib/mongoose';
import User from '../../../../models/User';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    await connectMongoDB();

    if (req.method === 'GET') {
      const session = await getServerSession(req, res, authOptions);
      const user = await User.findOne({ name: session.user.name }).select(
        'hasSeenOnboarding'
      );

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      return res.status(200).json({
        success: true,
        user: {
          hasSeenOnboarding: user.hasSeenOnboarding,
        },
      });
    }

    if (req.method === 'PATCH') {
      const session = await getServerSession(req, res, authOptions);

      if (!session) {
        return res
          .status(401)
          .json({ success: false, message: 'Not authenticated' });
      }

      const { hasSeenOnboarding } = req.body;

      if (typeof hasSeenOnboarding !== 'boolean') {
        return res
          .status(400)
          .json({ success: false, message: 'Invalid value' });
      }

      const user = await User.findOneAndUpdate(
        { name: session.user.name }, // Use session to find user
        { hasSeenOnboarding },
        { new: true }
      );

      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }

      return res
        .status(200)
        .json({ success: true, hasSeenOnboarding: user.hasSeenOnboarding });
    }
  } catch (error) {
    console.error('Error in user handler:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
