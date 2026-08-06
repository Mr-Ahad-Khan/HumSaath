const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
  eventName: { type: String, required: true, trim: true, maxlength: 160 },
  eventType: { type: String, required: true, trim: true, maxlength: 80 },
  eventDate: { type: Date, required: true },
  hostName: { type: String, required: true, trim: true, maxlength: 100 },
  hostUpi: { type: String, trim: true, maxlength: 120 },
  deliveryAddress: { type: String, trim: true, maxlength: 500 },
  city: { type: String, trim: true, maxlength: 100 },
  jitsiRoom: { type: String, trim: true, maxlength: 160 },
  giftsSent: { type: Number, default: 0, min: 0 },
  eatTogetherCount: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
