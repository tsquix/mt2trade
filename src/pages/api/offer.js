// Should be
import connectMongoDB from '../../../lib/mongoose';
import Offer from '../../../models/Offer';

export default async function handler(req, res) {
  try {
    const { method } = req;
    const { server } = req.query;
    const { userId } = req.query;
    await connectMongoDB();

    if (method === 'GET') {
      if (server) {
        // Find offers for specific server with populated seller data
        const offers = await Offer.find({ serverName: server })
          .populate('seller', 'name userRating prefPayment transactionCount')
          .exec();
        return res.status(200).json({ success: true, offers });
      } else if (userId) {
        // Find offers for specific server with populated seller data
        const offers = await Offer.find({ seller: userId })
          .populate('seller', 'name userRating prefPayment transactionCount')
          .exec();
        return res.status(200).json({ success: true, offers });
      } else {
        const offers = await Offer.find({})
          .populate('seller', 'name userRating prefPayment transactionCount')
          .exec();
        return res.status(200).json({ success: true, offers });
      }
    }
    if (method === 'PUT') {
      const { offerId, newCurrAmount } = req.body;

      await Offer.findByIdAndUpdate(offerId, {
        currencyAmount: newCurrAmount,
      });
      return res.status(200).json({ success: true });
    }
    if (method === 'POST') {
      const {
        seller,
        serverName,
        currencyType,
        currencyAmount,
        pricePLN,
        title,
        description,
      } = req.body;

      // // Validate required fields
      // if (!seller || !serverName || !currencyAmount || !pricePLN) {
      //   return res.status(400).json({
      //     success: false,
      //     message: 'Missing required fields',
      //   });
      // }

      // // Validate numeric values
      // if (isNaN(currencyAmount) || isNaN(pricePLN)) {
      //   return res.status(400).json({
      //     success: false,
      //     message: 'Invalid numeric values',
      //   });
      // }

      const offer = await Offer.create({
        seller,
        serverName,
        currencyAmount: Number(currencyAmount),
        currencyType,
        pricePLN: Number(pricePLN),
        description: description || '',
        title: title,
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
