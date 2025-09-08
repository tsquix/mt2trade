import connectMongoDB from '../../../../lib/mongoose';
import User from '../../../../models/User';
import Offer from '../../../../models/Offer';
import BuyOrder from '../../../../models/BuyOrder';
import { isAdminRequest } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    await connectMongoDB();
    await isAdminRequest(req, res);
    const { userId } = req.query;
    if (req.method === 'GET') {
      if (userId) {
        const user = await User.findById({ _id: userId }, '-password');
        const buyOrders = await BuyOrder.find({ buyer: userId })
          .populate({
            path: 'offer',
            select: 'serverName currencyAmount pricePLN title',
          })
          .populate('seller', 'name userRating prefPayment')
          .populate('buyer', 'name')
          .lean()
          .exec();

        const sellOrders = await BuyOrder.find({ seller: userId })
          .populate({
            path: 'offer',
            select: 'serverName currencyAmount pricePLN title',
          })
          .populate('seller', 'name userRating prefPayment')
          .populate('buyer', 'name')
          .lean()
          .exec();
        const offers = await Offer.find({ seller: userId })
          .populate(
            'seller',
            'name userRating prefPayment transactionCount avatar verified createdAt'
          )
          .exec();

        return res.status(200).json({
          success: true,
          user,
          userData: {
            buyOrders,
            sellOrders,
            offers,
          },
        });
      } else {
        const users = await User.find({}, '-password -sensData -loginHistory');
        return res.json(users);
      }
    }
    if (req.method === 'DELETE') {
      if (userId) {
        await Offer.deleteMany({ seller: userId });
        await BuyOrder.deleteMany({ seller: userId });
        await BuyOrder.deleteMany({ buyer: userId });

        await User.findByIdAndDelete({ _id: userId });

        return res.json({
          status: 'success',
          message: 'User and related data deleted',
        });
      }
    }

    res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Admin API error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
