import mongoose, { Schema } from 'mongoose';

const DcUserSchema = new mongoose.Schema({
  discordId: { type: String, required: true, unique: true, index: true },
  username: { type: String, required: true },
  displayName: { type: String },
  avatar: { type: String, required: false },
  accountAge: { type: Number, default: 0 },

  stats: {
    totalOffers: { type: Number, default: 0 },
    activeOffers: { type: Number, default: 0 },
    engagement: { type: Number, default: 0 }, // Komentarze innych
    ownerActivity: { type: Number, default: 0 }, // Wiadomości własne
    firstSeen: { type: Date, default: Date.now },
  },

  reputationScore: { type: Number, default: 0, index: -1 },
  lastUpdated: { type: Date },
  recentActivity: [
    {
      offerId: { type: Schema.Types.ObjectId, ref: 'DcOffer' },
      title: String,
      date: Date,
    },
  ],
});
export default mongoose.models.DcUser || mongoose.model('DcUser', DcUserSchema);
