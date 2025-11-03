// Should be
import connectMongoDB from '../../../lib/mongoose';
import Offer from '../../../models/Offer';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
export default async function handler(req, res) {
  try {
    const { method } = req;
    const { server } = req.query;
    const { userId } = req.query;

    await connectMongoDB();
    const session = await getServerSession(req, res, authOptions);

    if (method === 'GET') {
      // console.log(session.id);
      if (server) {
        // Find offers for specific server with populated seller data
        const offers = await Offer.find({ serverName: server })
          .populate(
            'seller',
            'name userRating prefPayment transactionCount avatar verified createdAt'
          )
          .exec();
        return res.status(200).json({ success: true, offers });
      } else if (userId) {
        const offers = await Offer.find({ seller: userId })
          .populate(
            'seller',
            'name userRating prefPayment transactionCount avatar verified createdAt'
          )
          .exec();
        return res.status(200).json({ success: true, offers });
      } else {
        const offers = await Offer.find({})
          .populate(
            'seller',
            'name userRating prefPayment transactionCount avatar'
          )
          .exec();
        return res.status(200).json({ success: true, offers });
      }
    }
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    if (method === 'PUT') {
      //TODO IF ZMIENIONA NAZWA / AUTOGENERATE NEW SLUG
      const { offerId, newCurrAmount, newOffer, toSlug } = req.body;
      if (!offerId) {
        return res.status(400).json({ success: false, error: 'Brak offerId' });
      }
      const offer = await Offer.findById(offerId);
      if (!offer) {
        return res
          .status(404)
          .json({ success: false, error: 'Nie znaleziono oferty' });
      }

      if (offer.seller._id.toString() !== session.user.id) {
        return res
          .status(403)
          .json({ success: false, error: 'Brak uprawnień' });
      }

      if (newCurrAmount) {
        await Offer.findByIdAndUpdate(offerId, {
          currencyAmount: newCurrAmount,
        });
        return res.status(200).json({ success: true });
      }
      if (newOffer) {
        const { title, currencyAmount, pricePLN, description } = newOffer;
        const baseSlug = title
          .toLowerCase()
          .trim()
          .replace(/[\s_]+/g, '-')
          .replace(/[^\w-]+/g, '');

        let slug = baseSlug;
        if (toSlug) {
          let attempt = 0;

          let existsBase = await Offer.find({ slug: baseSlug });
          if (existsBase.length === 0) {
            slug = baseSlug;
          } else {
            //generate free slugtitle
            while (true) {
              const timestamp = Date.now().toString().slice(-4);
              slug = `${baseSlug}-${timestamp}`;

              const exists = await Offer.find({ slug });
              if (exists.length === 0) break;

              attempt++;

              if (attempt > 10) {
                const timestamp6 = Date.now().toString().slice(-6);
                const random = Math.floor(Math.random() * 100);
                slug = `${baseSlug}-${timestamp6}-${random}`;

                const exists6 = await Offer.find({ slug });
                if (exists6.length === 0) break;
              }
              await new Promise((r) => setTimeout(r, 1));
            }
          }
        }

        const updateData = {
          title,
          currencyAmount,
          pricePLN,
          description,
          slug,
        };
        await Offer.findByIdAndUpdate(offerId, updateData);
        return res.status(200).json({ success: true });
      }
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

      const baseSlug = title
        .toLowerCase()
        .trim()
        .replace(/[\s_]+/g, '-')
        .replace(/[^\w-]+/g, '');

      let slug = baseSlug;
      let attempt = 0;

      let existsBase = await Offer.find({ slug: baseSlug });
      if (existsBase.length === 0) {
        slug = baseSlug;
      } else {
        //generate free slugtitle
        while (true) {
          const timestamp = Date.now().toString().slice(-4);
          slug = `${baseSlug}-${timestamp}`;

          const exists = await Offer.find({ slug });
          if (exists.length === 0) break;

          attempt++;

          if (attempt > 10) {
            const timestamp6 = Date.now().toString().slice(-6);
            const random = Math.floor(Math.random() * 100);
            slug = `${baseSlug}-${timestamp6}-${random}`;

            const exists6 = await Offer.find({ slug });
            if (exists6.length === 0) break;
          }

          await new Promise((r) => setTimeout(r, 1));
        }
      }

      const offer = await Offer.create({
        seller,
        serverName,
        currencyAmount: Number(currencyAmount),
        currencyType,
        pricePLN: Number(pricePLN),
        description: description || '',
        title: title,
        slug,
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
