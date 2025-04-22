import mongoose from 'mongoose';

const OfferSchema = new mongoose.Schema({
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  serverName: { type: String, required: true },
  currencyAmount: { type: Number, required: true },
  currencyType: { type: String, required: true },
  pricePLN: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Offer || mongoose.model('Offer', OfferSchema);
