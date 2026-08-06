const express = require('express');
const { body, validationResult } = require('express-validator');
const Event = require('../models/Event');
const Blessing = require('../models/Blessing');
const Comment = require('../models/Comment');
const Reaction = require('../models/Reaction');

const router = express.Router();
const reactionTypes = ['Love', 'Applause', 'Celebrate', 'Blessings'];

function respondValidationErrors(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) { res.status(400).json({ message: 'Please correct the highlighted fields.', errors: errors.array() }); return true; }
  return false;
}

router.post('/', [
  body('slug').trim().isSlug().withMessage('A valid event slug is required'),
  body('eventName').trim().notEmpty().withMessage('Event name is required'),
  body('eventType').trim().notEmpty().withMessage('Event type is required'),
  body('eventDate').isISO8601().withMessage('A valid event date is required'),
  body('hostName').trim().notEmpty().withMessage('Host name is required')
], async (req, res, next) => {
  if (respondValidationErrors(req, res)) return;
  try {
    const event = await Event.create(req.body);
    res.status(201).json({ success: true, event });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'This event link is already in use.' });
    next(error);
  }
});

router.get('/:slug', async (req, res, next) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug.toLowerCase() });
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    const [blessings, reactions, comments] = await Promise.all([
      Blessing.find({ event: event._id }).select('amount'),
      Reaction.find({ event: event._id }).select('type count -_id'),
      Comment.find({ event: event._id }).sort({ createdAt: -1 }).limit(30).select('guestName message createdAt')
    ]);
    const totals = { blessingAmount: blessings.reduce((sum, blessing) => sum + blessing.amount, 0), wellwisherCount: blessings.length };
    res.json({ success: true, event, totals, reactions, comments });
  } catch (error) { next(error); }
});

router.post('/:slug/blessings', [body('guestName').trim().notEmpty(), body('amount').isFloat({ min: 1 }), body('note').optional().trim().isLength({ max: 280 })], async (req, res, next) => {
  if (respondValidationErrors(req, res)) return;
  try {
    const event = await Event.findOne({ slug: req.params.slug.toLowerCase() });
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    const blessing = await Blessing.create({ event: event._id, guestName: req.body.guestName, amount: req.body.amount, note: req.body.note });
    res.status(201).json({ success: true, blessing });
  } catch (error) { next(error); }
});

router.post('/:slug/comments', [body('message').trim().notEmpty().isLength({ max: 280 }), body('guestName').optional().trim().isLength({ max: 50 })], async (req, res, next) => {
  if (respondValidationErrors(req, res)) return;
  try {
    const event = await Event.findOne({ slug: req.params.slug.toLowerCase() });
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    const comment = await Comment.create({ event: event._id, guestName: req.body.guestName || 'Guest', message: req.body.message });
    res.status(201).json({ success: true, comment });
  } catch (error) { next(error); }
});

router.post('/:slug/reactions', [body('type').isIn(reactionTypes)], async (req, res, next) => {
  if (respondValidationErrors(req, res)) return;
  try {
    const event = await Event.findOne({ slug: req.params.slug.toLowerCase() });
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    const reaction = await Reaction.findOneAndUpdate({ event: event._id, type: req.body.type }, { $inc: { count: 1 } }, { new: true, upsert: true, setDefaultsOnInsert: true });
    res.json({ success: true, reaction });
  } catch (error) { next(error); }
});

router.post('/:slug/engagement', [body('type').isIn(['gift', 'eatTogether'])], async (req, res, next) => {
  if (respondValidationErrors(req, res)) return;
  try {
    const update = req.body.type === 'gift' ? { $inc: { giftsSent: 1 } } : { $inc: { eatTogetherCount: 1 } };
    const event = await Event.findOneAndUpdate({ slug: req.params.slug.toLowerCase() }, update, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    res.json({ success: true, event });
  } catch (error) { next(error); }
});

module.exports = router;
