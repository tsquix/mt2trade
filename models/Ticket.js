import mongoose from 'mongoose';

const TicketSchema = new mongoose.Schema({
  buyOrder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'BuyOrder',
    required: true,
  },
  description: { type: String, required: true },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Ticket || mongoose.model('Ticket', TicketSchema);
