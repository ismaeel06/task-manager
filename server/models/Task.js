const mongoose = require('mongoose');

const subtaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  completed: {
    type: Boolean,
    default: false
  }
});

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  dueDate: {
    type: Date
  },
  completed: {
    type: Boolean,
    default: false
  },
  list: {
    type: String,
    enum: ['Personal', 'Work', 'List 1'],
    default: 'Personal'
  },
  tags: [{
    type: String,
    trim: true
  }],
  subtasks: [subtaskSchema],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  }
}, {
  timestamps: true
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task; 