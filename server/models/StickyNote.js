const mongoose = require('mongoose');

const stickyNoteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  color: {
    type: String,
    default: '#fff8e1',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
}, { timestamps: true });

module.exports = mongoose.model('StickyNote', stickyNoteSchema); 