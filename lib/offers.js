import connectMongoDB from './mongoose';
import Offer from '../models/Offer';

export async function getOffersByServer(serverName) {
  try {
    await connectMongoDB();

    const offers = await Offer.find({ serverName })
      .populate(
        'seller',
        'name userRating prefPayment transactionCount avatar verified createdAt'
      )
      .exec();

    return offers;
  } catch (error) {
    console.error('Error fetching:', error);
    return [];
  }
}

export async function getOfferCountByServer(serverName) {
  try {
    await connectMongoDB();

    const count = await Offer.countDocuments({ serverName });

    return count;
  } catch (error) {
    console.error('Error counting:', error);
    return 0;
  }
}

export async function getAllOffersCount() {
  try {
    await connectMongoDB();

    const pipeline = [
      {
        $group: {
          _id: '$serverName',
          count: { $sum: 1 },
        },
      },
    ];

    const results = await Offer.aggregate(pipeline);

    const countsMap = {};
    results.forEach((result) => {
      countsMap[result._id] = result.count;
    });

    return countsMap;
  } catch (error) {
    console.error('Error getting all offers count:', error);
    return {};
  }
}
