import connectMongoDB from '../../../../lib/mongoose';
import DcUser from '../../../../models/DcUser';
import { isAdminRequest } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  try {
    await connectMongoDB();
    await isAdminRequest(req, res);
    if (req.method === 'GET') {
      const dcusers = await DcUser.find({});
      return res.status(200).json(dcusers);
    } else {
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error fetching dcusers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
