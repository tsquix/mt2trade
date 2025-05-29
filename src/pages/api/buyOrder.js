import connectMongoDB from '../../../lib/mongoose';

import BuyOrder from '../../../models/BuyOrder';
import User from '../../../models/User';
import '../../../models/Offer';

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
    if (method === 'PUT') {
      const { status, orderId, currencyUpdated } = req.body;
      try {
        if (status) {
          await BuyOrder.findByIdAndUpdate(orderId, {
            orderStatus: status,
          });
        } else if (currencyUpdated !== undefined) {
          await BuyOrder.findByIdAndUpdate(orderId, {
            currencyUpdated: currencyUpdated,
          });
        }
        return res.status(200).json({ success: true });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, error: error.message });
      }
    }
    if (method === 'DELETE') {
      const { orderId } = req.query;
      await BuyOrder.findByIdAndDelete(orderId);
      res.json(true);
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
      const sellerUser = await User.findById(seller);
      console.log('Seller user found:', sellerUser);
      console.log('Push subscription:', sellerUser?.pushSubscription);

      if (sellerUser?.pushSubscription) {
        try {
          const response = await fetch(
            'http://localhost:3000/api/send-notification',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                endpoint: sellerUser.pushSubscription.endpoint,
                keys: sellerUser.pushSubscription.keys,
                message: {
                  title: 'New Order Received!',
                  body: `You have a new order for ${currencyAmount} currency`,
                  icon: '/icon.png',
                },
              }),
            }
          );

          if (!response.ok) {
            throw new Error(
              `Failed to send notification: ${response.statusText}`
            );
          }
        } catch (error) {
          console.error('Error sending notification:', error);
        }
      } else {
        console.log('No push subscription found for seller');
      }

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
