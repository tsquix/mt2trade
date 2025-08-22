import connectMongoDB from '../../../lib/mongoose';
import Message from '../../../models/Message';

export default async function handler(req, res) {
  const { method } = req;
  await connectMongoDB();

  if (method === 'POST') {
    const { email, topic, message } = req.body;
    const msg = await Message.create({ email, topic, message });
    return res.status(200).json({ success: true, data: msg });
  }

  if (method === 'GET') {
    const messages = await Message.find();
    return res.status(200).json({ success: true, data: messages });
  }
  if (method === 'DELETE') {
    const { msgId } = req.query;
    await Message.findByIdAndDelete(msgId);
    res.json(true);
  }
  return res
    .status(405)
    .json({ success: false, message: 'Method not allowed' });
}
