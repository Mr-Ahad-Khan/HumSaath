const mongoose = require('mongoose');

const reactionSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  type: { type: String, required: true, enum: ['Love', 'Applause', 'Celebrate', 'Blessings'] },
  count: { type: Number, default: 0, min: 0 }
}, { timestamps: true });

reactionSchema.index({ event: 1, type: 1 }, { unique: true });

module.exports = mongoose.model('Reaction', reactionSchema);
