const mongoose = require('mongoose');

const dcOfferSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    serverName: {
      type: String,
      default: 'uncategorized',
      index: true, // Dodaj indeks dla szybszego wyszukiwania
    },
    serverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Server',
      default: null,
      index: true,
    },
    thread: {
      name: {
        type: String,
        required: true,
        trim: true,
      },
      tags: [
        {
          id: String,
          name: String,
          emoji: {
            id: String,
            name: String,
          },
        },
      ],
      createdAt: {
        type: Date,
        required: true,
        index: true,
      },
      owner: {
        id: {
          type: String,
          required: true,
          index: true,
        },
        name: String,
        displayName: String,
        bot: {
          type: Boolean,
          default: false,
        },
        createdAt: Date,
        accountAge: {
          days: Number,
          timestamp: Number,
        },
        avatar: {
          url: String,
          defaultUrl: String,
          guildUrl: String,
        },
      },
    },
    starterMessage: {
      content: {
        type: String,
        default: '',
      },
      editedAt: Date,
    },
    messageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    ownerMessages: [
      {
        id: String,
        content: String,
        timestamp: Date,
        editedAt: Date,
        attachments: [
          {
            id: String,
            filename: String,
            url: String,
            size: Number,
            contentType: String,
          },
        ],
      },
    ],
    createdAt: {
      type: Date,
      required: true,
      index: true,
    },
    lastActivity: {
      type: Date,
      required: true,
      index: true,
    },
    scrapedAt: {
      type: Date,
      default: Date.now,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    status: {
      type: String,
      enum: ['active', 'sold', 'closed', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
    collection: 'dc_offers',
  }
);

// Indeksy
dcOfferSchema.index({ lastActivity: -1, isActive: 1 });
dcOfferSchema.index({ 'thread.owner.id': 1, lastActivity: -1 });
dcOfferSchema.index({ 'thread.tags.name': 1 });
dcOfferSchema.index({ status: 1, lastActivity: -1 });
dcOfferSchema.index({ serverName: 1, lastActivity: -1 });

// Virtuals
dcOfferSchema.virtual('title').get(function () {
  return this.thread.name;
});

dcOfferSchema.virtual('seller').get(function () {
  return this.thread.owner;
});

// Metody instancji
dcOfferSchema.methods.markAsSold = function () {
  this.status = 'sold';
  this.isActive = false;
  return this.save();
};

dcOfferSchema.methods.updateActivity = function () {
  this.lastActivity = new Date();
  this.scrapedAt = new Date();
  return this.save();
};

// Metody statyczne
dcOfferSchema.statics.getRecentOffers = function (limit = 10) {
  return this.find({ isActive: true }).sort({ lastActivity: -1 }).limit(limit);
};

dcOfferSchema.statics.getOffersBySeller = function (sellerId) {
  return this.find({ 'thread.owner.id': sellerId }).sort({ lastActivity: -1 });
};

dcOfferSchema.statics.getOffersByTag = function (tagName) {
  return this.find({ 'thread.tags.name': tagName, isActive: true }).sort({
    lastActivity: -1,
  });
};

dcOfferSchema.statics.getOffersByServer = function (serverName) {
  return this.find({ serverName, isActive: true }).sort({ lastActivity: -1 });
};

dcOfferSchema.statics.searchOffers = function (searchText) {
  return this.find({
    $or: [
      { 'thread.name': { $regex: searchText, $options: 'i' } },
      { 'starterMessage.content': { $regex: searchText, $options: 'i' } },
    ],
    isActive: true,
  }).sort({ lastActivity: -1 });
};

// Middleware pre-save
dcOfferSchema.pre('save', function (next) {
  this.scrapedAt = new Date();
  next();
});

const DcOffer =
  mongoose.models.DcOffer || mongoose.model('DcOffer', dcOfferSchema);

module.exports = DcOffer;
