import mongoose from 'mongoose';

const BuyOrderSchema = new mongoose.Schema({
  offer: { type: mongoose.Schema.Types.ObjectId, ref: 'Offer', required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currencyAmount: { type: Number, required: true },
  seen: { type: Boolean, default: false },
  orderStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'finalized'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
  rated: {
    type: String,
    enum: ['yes', 'reported', 'no', 'skipped'],
    default: 'no',
  },
  currencyUpdated: { type: Boolean, default: false },
});

export default mongoose.models.BuyOrder ||
  mongoose.model('BuyOrder', BuyOrderSchema);
