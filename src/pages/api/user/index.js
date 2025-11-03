import connectMongoDB from '../../../../lib/mongoose';
import User from '../../../../models/User';

export default async function handler(req, res) {
  try {
    await connectMongoDB();
    if (req.method === 'GET') {
      // Optimize database query by selecting only needed fields
      const users = await User.find().select('_id name avatar');

      if (!users) {
        return res.status(404).json({
          success: false,
          message: 'User not found',
        });
      }

      return res.status(200).json({
        success: true,
        users: users.map((user) => ({
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
        })),
      });
    }
  } catch (error) {
    console.error('Error in user handler:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
