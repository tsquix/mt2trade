// pages/api/user/[username].js
import connectMongoDB from '../../../../lib/mongoose';
import User from '../../../../models/User';

// Cache control headers
const setCacheHeaders = (res) => {
  // Cache response for 5 minutes
  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
};

export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res
        .status(405)
        .json({ success: false, message: 'Method not allowed' });
    }

    await connectMongoDB();
    const { username } = req.query;

    // Optimize database query by selecting only needed fields
    const user = await User.findOne({ name: username }).select(
      'name userRating prefPayment transactionCount verified createdAt'
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Set cache headers
    setCacheHeaders(res);

    return res.status(200).json({
      success: true,
      user: {
        name: user.name,
        userRating: user.userRating,
        transactionCount: user.transactionCount,
        prefPayment: user.prefPayment,
        verified: user.verified,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Error in user handler:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
