import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  pushSubscription?: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  };
  sensData: {
    ipHistory: string[];
  }[];
  loginHistory: {
    ip: string;
    browser: string;
    timestamp: Date;
    success: boolean;
    location?: string;
    deviceType?: string;
  }[];
  role: 'user' | 'admin';
  userRating: number;
  ratingCount: number;
  transactionCount: number;
  prefPayment: 'BLIK' | 'przelew' | 'revolut' | 'paypal';
  verified: boolean;
  createdAt: Date;
  avatar: string;
}

const UserSchema = new mongoose.Schema<IUser>({
  name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pushSubscription: {
    endpoint: String,
    keys: {
      p256dh: String,
      auth: String,
    },
  },
  loginHistory: {
    type: [
      {
        ip: { type: String, required: true },
        browser: { type: String, required: true },
        timestamp: { type: Date, required: true },
        success: { type: Boolean, required: true },
        location: { type: String },
        deviceType: { type: String },
      },
    ],
    default: [],
  },

  sensData: {
    ipHistory: { type: [String], default: [] },
    // any other sensitive info can go here
  },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  userRating: { type: Number, default: 0, min: 0, max: 5 },
  ratingCount: { type: Number, default: 0 },
  transactionCount: { type: Number, default: 0 },
  prefPayment: {
    type: String,
    enum: ['BLIK', 'przelew', 'revolut', 'paypal'],
    default: 'BLIK',
  },
  verified: { type: Boolean, default: false }, // czy użytkownik został ręcznie zweryfikowany
  createdAt: { type: Date, default: Date.now },
  avatar: {
    type: String,
    default:
      'https://cdn.tipo.live/files/avatar/48968_avatar.jpg?id=fa2f0c061cfb9c5000b18d2561baf330',
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
