import connectMongoDB from '../../../../lib/mongoose';
import User from '../../../../models/User';

export default async function handler(req, res) {
  try {
    await connectMongoDB();
    const { username } = req.query;

    if (req.method === 'GET') {
      const user = await User.findOne({ name: username }).select(
        'name userRating prefPayment transactionCount'
      );
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'User not found' });
      }

      return res.status(200).json({
        success: true,
        user: {
          name: user.name,
          userRating: user.userRating,
          transactionCount: user.transactionCount,
          prefPayment: user.prefPayment,
        },
      });
    }

    return res
      .status(405)
      .json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    console.error('Error in user handler:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
