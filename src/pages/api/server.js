import connectMongoDB from '../../../lib/mongoose';
import Server from '../../../models/Server';

export default async function handler(req, res) {
  try {
    const { method } = req;
    await connectMongoDB();

    if (method === 'POST') {
      const { name, slug, img } = req.body;

      // Validate required fields
      if (!name || !slug) {
        return res.status(400).json({
          success: false,
          message: 'Name and slug are required fields',
        });
      }

      // Check if server with this name or slug already exists
      const existingServer = await Server.findOne({
        $or: [{ name }, { slug }]
      });

      if (existingServer) {
        return res.status(400).json({
          success: false,
          message: 'A server with this name or slug already exists',
        });
      }

      // Create new server
      const server = await Server.create({
        name,
        slug,
        img: img || '',
      });

      return res.status(201).json({
        success: true,
        data: server,
        message: 'Server created successfully',
      });
    }

    if (method === 'GET') {
      const servers = await Server.find({});
      return res.status(200).json({ success: true, data: servers });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });
  } catch (error) {
    console.error('Error in server handler:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}