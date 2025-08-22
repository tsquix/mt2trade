import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  email: { type: String },
  topic: { type: String },
  message: { type: String },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Message ||
  mongoose.model('Message', MessageSchema);
