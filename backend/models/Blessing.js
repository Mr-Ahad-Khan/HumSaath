const mongoose = require('mongoose');

const blessingSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  guestName: { type: String, required: true, trim: true, maxlength: 100 },
  amount: { type: Number, required: true, min: 1 },
  note: { type: String, trim: true, maxlength: 280 }
}, { timestamps: true });

module.exports = mongoose.model('Blessing', blessingSchema);
