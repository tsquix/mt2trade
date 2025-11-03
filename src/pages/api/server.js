import connectMongoDB from '../../../lib/mongoose';
import Server from '../../../models/Server';

export default async function handler(req, res) {
  try {
    const { method, query } = req;
    await connectMongoDB();

    // --- CREATE ---
    if (method === 'POST') {
      const { name, slug, img, nameAlias } = req.body;

      if (!nameAlias) {
        return res.status(400).json({
          success: false,
          message: 'nameAlias are required fields',
        });
      }
      if (!name || !slug) {
        return res.status(400).json({
          success: false,
          message: 'Name and slug are required fields',
        });
      }

      const existingServer = await Server.findOne({
        $or: [{ name }, { slug }],
      });

      if (existingServer) {
        return res.status(400).json({
          success: false,
          message: 'A server with this name or slug already exists',
        });
      }

      const server = await Server.create({
        name,
        slug,
        img: img || '',
        nameAlias,
      });

      return res.status(201).json({
        success: true,
        data: server,
        message: 'Server created successfully',
      });
    }

    // --- READ ---
    if (method === 'GET') {
      const { id } = query;

      if (id) {
        const server = await Server.findById(id);
        if (!server) {
          return res.status(404).json({
            success: false,
            message: 'Server not found',
          });
        }
        return res.status(200).json({ success: true, data: server });
      }

      const servers = await Server.find({});
      return res.status(200).json({ success: true, data: servers });
    }

    // --- FULL UPDATE ---
    if (method === 'PUT') {
      const { id } = query;
      const { name, slug, img, nameAlias } = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Server ID is required for update',
        });
      }

      const updated = await Server.findByIdAndUpdate(
        id,
        { name, slug, img, nameAlias },
        { new: true, runValidators: true }
      );

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Server not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: updated,
        message: 'Server updated successfully (PUT)',
      });
    }

    // --- PARTIAL UPDATE (PATCH) ---
    if (method === 'PATCH') {
      const { id } = query;
      const updates = req.body;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Server ID is required for patch update',
        });
      }

      // Remove undefined fields so we don’t overwrite existing data
      Object.keys(updates).forEach(
        (key) => updates[key] === undefined && delete updates[key]
      );

      const updated = await Server.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!updated) {
        return res.status(404).json({
          success: false,
          message: 'Server not found',
        });
      }

      return res.status(200).json({
        success: true,
        data: updated,
        message: 'Server partially updated successfully (PATCH)',
      });
    }

    // --- DELETE ---
    if (method === 'DELETE') {
      const { id } = query;

      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'Server ID is required for deletion',
        });
      }

      const deleted = await Server.findByIdAndDelete(id);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Server not found',
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Server deleted successfully',
      });
    }

    // --- METHOD NOT ALLOWED ---
    return res.status(405).json({
      success: false,
      message: `Method ${method} not allowed`,
    });
  } catch (error) {
    console.error('Error in server handler:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
