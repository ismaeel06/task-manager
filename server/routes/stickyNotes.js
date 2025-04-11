const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const StickyNote = require('../models/StickyNote');

// Get all sticky notes for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    console.log('Fetching notes for user:', req.user.id);
    const notes = await StickyNote.find({ user: req.user.id }).sort({ createdAt: -1 });
    console.log('Found notes:', notes.length);
    res.json(notes);
  } catch (error) {
    console.error('Error fetching sticky notes:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Create a new sticky note
router.post('/', auth, async (req, res) => {
  try {
    console.log('Creating note for user:', req.user.id);
    const { content, color, position } = req.body;
    
    if (!content && content !== '') {
      return res.status(400).json({ message: 'Content is required' });
    }

    const newNote = new StickyNote({
      content: content || '',
      color: color || '#fff8e1',
      position: position || { x: 0, y: 0 },
      user: req.user.id,
    });

    const savedNote = await newNote.save();
    console.log('Note created:', savedNote._id);
    res.status(201).json(savedNote);
  } catch (error) {
    console.error('Error creating sticky note:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Update a sticky note
router.put('/:id', auth, async (req, res) => {
  try {
    console.log('Updating note:', req.params.id);
    const { content, color, position } = req.body;
    const note = await StickyNote.findById(req.params.id);

    if (!note) {
      console.log('Note not found:', req.params.id);
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.user.toString() !== req.user.id) {
      console.log('Unauthorized access attempt:', req.user.id);
      return res.status(401).json({ message: 'Not authorized' });
    }

    note.content = content !== undefined ? content : note.content;
    note.color = color || note.color;
    note.position = position || note.position;

    const updatedNote = await note.save();
    console.log('Note updated:', updatedNote._id);
    res.json(updatedNote);
  } catch (error) {
    console.error('Error updating sticky note:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

// Delete a sticky note
router.delete('/:id', auth, async (req, res) => {
  try {
    console.log('Deleting note:', req.params.id);
    const note = await StickyNote.findById(req.params.id);

    if (!note) {
      console.log('Note not found:', req.params.id);
      return res.status(404).json({ message: 'Note not found' });
    }

    if (note.user.toString() !== req.user.id) {
      console.log('Unauthorized delete attempt:', req.user.id);
      return res.status(401).json({ message: 'Not authorized' });
    }

    await note.deleteOne();
    console.log('Note deleted:', req.params.id);
    res.json({ message: 'Note removed' });
  } catch (error) {
    console.error('Error deleting sticky note:', error);
    res.status(500).json({ 
      message: 'Server error',
      error: error.message 
    });
  }
});

module.exports = router; 