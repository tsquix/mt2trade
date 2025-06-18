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
    await connectMongoDB();
    const { username } = req.query;

    if (req.method === 'GET') {
      // Optimize database query by selecting only needed fields
      const user = await User.findOne({ name: username }).select(
        '_id name userRating prefPayment transactionCount verified createdAt'
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
          _id: user._id,
          name: user.name,
          userRating: user.userRating,
          transactionCount: user.transactionCount,
          prefPayment: user.prefPayment,
          verified: user.verified,
          createdAt: user.createdAt,
        },
      });
    }
    if (req.method === 'PUT') {
      const { username } = req.query;
      const { newRate } = req.body;

      // Walidacja wejścia
      if (typeof newRate !== 'number' || isNaN(newRate)) {
        return res.status(400).json({ error: 'Invalid newRate value' });
      }

      const user = await User.findOne({ name: username });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const updatedTransactionCount = user.transactionCount + 1;
      if (newRate) {
        const updatedRatingCount = user.ratingCount + 1;
        const updatedRating =
          (user.userRating * user.transactionCount + newRate) /
          updatedTransactionCount;
        await User.findOneAndUpdate(
          { name: username },
          {
            ratingCount: updatedRatingCount,
            userRating: updatedRating,
          }
        );
      }
      // else {
      //   await User.findOneAndUpdate(
      //     { name: username }, // <--- poprawione
      //     {
      //       transactionCount: updatedTransactionCount,
      //     }
      //   );
      // }

      res.status(200).json({ message: 'User updated successfully' });
    }
  } catch (error) {
    console.error('Error in user handler:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
