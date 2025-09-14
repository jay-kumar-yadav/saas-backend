const Note = require('../models/Note');

// Get all notes for current tenant
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ tenantId: req.user.tenantId })
      .populate('createdBy', 'email')
      .sort({ createdAt: -1 });
    
    res.json(notes);
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single note
const getNote = async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      tenantId: req.user.tenantId 
    }).populate('createdBy', 'email');
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json(note);
  } catch (error) {
    console.error('Get note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new note
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const note = new Note({
      title,
      content,
      tenantId: req.user.tenantId,
      createdBy: req.user.id
    });
    
    const createdNote = await note.save();
    await createdNote.populate('createdBy', 'email');
    
    res.status(201).json(createdNote);
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update note
const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    const note = await Note.findOne({ 
      _id: req.params.id, 
      tenantId: req.user.tenantId 
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    note.title = title || note.title;
    note.content = content || note.content;
    
    const updatedNote = await note.save();
    await updatedNote.populate('createdBy', 'email');
    
    res.json(updatedNote);
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id, 
      tenantId: req.user.tenantId 
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    await Note.deleteOne({ _id: req.params.id });
    res.json({ message: 'Note removed' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
};