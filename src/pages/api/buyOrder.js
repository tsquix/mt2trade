import connectMongoDB from '../../../lib/mongoose';

import BuyOrder from '../../../models/BuyOrder';
import User from '../../../models/User';
import '../../../models/Offer'; // Add this import to register the Offer model

export default async function handler(req, res) {
  try {
    const { method } = req;
    const { server } = req.query;
    const { userId } = req.query;
    await connectMongoDB();

    // const seller = await User.findById(userId);
    // if (seller?.pushSubscription) {
    //   await sendPushNotification(seller.pushSubscription, {
    //     title: 'Nowa oferta kupna!',
    //     body: 'Masz nowe zamówienie. Sprawdź panel sprzedawcy.',
    //   });
    // }

    if (method === 'GET') {
      if (userId) {
        try {
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

          if (!buyOrders || !sellOrders) {
            return res.status(404).json({
              success: false,
              message: 'Orders not found',
            });
          }

          return res.status(200).json({
            success: true,
            orders: {
              buyOrders,
              sellOrders,
            },
          });
        } catch (error) {
          console.error('Error fetching orders:', error);
          return res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error.message,
          });
        }
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

      // Znajdź sprzedawcę i wyślij powiadomienie
      // const sellerUser = await User.findById(seller);
      // console.log('Seller user found:', sellerUser);
      // console.log('Push subscription:', sellerUser?.pushSubscription);

      // if (sellerUser?.pushSubscription) {
      //   try {
      //     await sendPushNotification(sellerUser.pushSubscription, {
      //       title: 'Nowe zamówienie!',
      //       body: `Użytkownik ${buyer.name} chce kupić ${currencyAmount} waluty`,
      //     });
      //     console.log('Push notification sent successfully');
      //   } catch (error) {
      //     console.error('Push notification error:', error);
      //     console.error(
      //       'Push subscription details:',
      //       sellerUser.pushSubscription
      //     );
      //   }
      // } else {
      //   console.log('No push subscription found for seller');
      // }

      return res.status(201).json({
        success: true,
        data: newBuyOrder,
        message: 'Order created successfully',
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
