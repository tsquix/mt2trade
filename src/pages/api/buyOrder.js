// Should be
import connectMongoDB from '../../../lib/mongoose';
import BuyOrder from '../../../models/BuyOrder';

export default async function handler(req, res) {
  try {
    const { method } = req;
    const { server } = req.query;
    const { userId } = req.query;
    await connectMongoDB();

    if (method === 'GET') {
      if (userId) {
        const buyOrders = await BuyOrder.find({ buyer: userId })
          .populate('offer')
          .populate('seller', 'name')
          .populate('buyer', 'name')
          .exec();

        const sellOrders = await BuyOrder.find({ seller: userId })
          .populate('offer')
          .populate('seller', 'name')
          .populate('buyer', 'name')
          .exec();

        return res.status(200).json({
          success: true,
          orders: {
            buyOrders,
            sellOrders, // Uncommented to return both types of orders
          },
        });
      } else {
        // Return 400 only if userId is not provided for GET
        return res.status(400).json({
          success: false,
          message: 'userId is required for GET requests',
        });
      }
    }

    if (method === 'POST') {
      const { offer, buyer, seller, currencyAmount } = req.body;

      const newBuyOrder = await BuyOrder.create({
        offer: offer,
        seller: seller,
        buyer: buyer.id,
        currencyAmount: currencyAmount,
      });

      return res.status(201).json({
        success: true,
        data: offer,
        message: 'Offer created successfully',
      });
    }

    return res
      .status(405)
      .json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    console.error('Error in offer handler:', error);
    // More detailed error logging
    if (error.name === 'ValidationError') {
      // Mongoose validation error
      const errors = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        error: 'Validation Error',
        details: errors,
      });
    } else if (error.code === 11000) {
      // Duplicate key error
      return res.status(400).json({
        success: false,
        error: 'Duplicate Entry',
        field: Object.keys(error.keyPattern)[0],
      });
    }

    // For all other errors
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
}
