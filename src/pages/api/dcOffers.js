import connectMongoDB from '../../../lib/mongoose';
import DcOffer from '../../../models/DcOffer';

export default async function handler(req, res) {
  const { method } = req;
  const { server, owner, limit } = req.query;
  await connectMongoDB();

  try {
    if (method === 'GET') {
      let query = {};
      if (server) {
        query.serverName = server;
        query.isActive = true;
      }
      if (owner) {
        query['thread.owner.id'] = owner;
      }
      let dcOffersQuery = DcOffer.find(query);
      if (limit) {
        dcOffersQuery = dcOffersQuery.limit(parseInt(limit));
      }
      const dcOffers = await dcOffersQuery.sort({ lastActivity: -1 });

      return res.status(200).json({ success: true, data: dcOffers });
    }

    if (method === 'DELETE') {
      try {
        const { id } = req.query;
        if (id === 'all') {
          await DcOffer.deleteMany();
        } else {
          await DcOffer.findByIdAndDelete(id);
        }

        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
    }

    if (method === 'PATCH') {
      try {
        const { id } = req.query;
        const { status } = req.body;
        await DcOffer.findByIdAndUpdate(id, { status });
        res.status(200).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false, message: error.message });
      }
    }

    return res
      .status(405)
      .json({ success: false, error: 'Method Not Allowed' });
  } catch (error) {
    console.error('API Error:', error);
    return res
      .status(500)
      .json({ success: false, error: 'Internal Server Error' });
  }
}
