import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // role: { type: String, enum: ["buyer", "seller"], default: "buyer" }, // można rozszerzyć w przyszłości
  userRating: { type: Number, default: 0, min: 0, max: 5 },
  transactionCount: { type: Number, default: 0 },
  prefPayment: {
    type: String,
    enum: ['BLIK', 'przelew', 'revolut', 'paypal'],
    default: 'BLIK',
  },
  verified: { type: Boolean, default: false }, // czy użytkownik został ręcznie zweryfikowany
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
