import mongoose from 'mongoose';

const ServerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true },
  nameAlias: { type: Array },
  img: { type: String },
});

export default mongoose.models.Server || mongoose.model('Server', ServerSchema);
