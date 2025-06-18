import connectMongoDB from '../../../lib/mongoose';
import Ticket from '../../../models/Ticket';
import '../../../models/BuyOrder';
export default async function handler(req, res) {
  const { method } = req;

  const { buyOrder, description, images } = req.body;

  await connectMongoDB();
  try {
    if (method === 'POST') {
      const ticket = await Ticket.create({
        buyOrder,
        description,
        images,
      });
      return res.status(200).json({ success: true });
    }
    if (method === 'GET') {
      const tickets = await Ticket.find().populate({
        path: 'buyOrder',
        populate: [{ path: 'buyer' }, { path: 'seller' }],
      });
      return res.status(200).json({ success: true, data: tickets });
    }
    if (method === 'DELETE') {
      const { ticketId } = req.query;
      await Ticket.findByIdAndDelete(ticketId);
      res.json(true);
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, error: 'Internal Server Error' });
  }
}
