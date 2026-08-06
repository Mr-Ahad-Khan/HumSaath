const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  guestName: { type: String, trim: true, maxlength: 50, default: 'Guest' },
  message: { type: String, required: true, trim: true, maxlength: 280 }
}, { timestamps: true });

module.exports = mongoose.model('Comment', commentSchema);
