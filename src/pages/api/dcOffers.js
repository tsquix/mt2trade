import connectMongoDB from '../../../lib/mongoose';
import DcOffer from '../../../models/DcOffer';

export default async function handler(req, res) {
  const { method } = req;
  const { server } = req.query;
  await connectMongoDB();

  try {
    if (method === 'GET') {
      if (server) {
        const dcOffers = await DcOffer.find({ serverName: server });
        return res.status(200).json({ success: true, data: dcOffers });
      } else {
        const dcOffers = await DcOffer.find();
        return res.status(200).json({ success: true, data: dcOffers });
      }
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
