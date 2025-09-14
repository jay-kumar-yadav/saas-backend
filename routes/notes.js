const express = require('express');
const {
  getNotes,
  getNote,
  createNote,
  updateNote,
  deleteNote
} = require('../controllers/notesController');
const { protect } = require('../middleware/auth');
const { checkNoteLimit } = require('../middleware/tenant');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getNotes)
  .post(checkNoteLimit, createNote);

router.route('/:id')
  .get(getNote)
  .put(updateNote)
  .delete(deleteNote);

module.exports = router;