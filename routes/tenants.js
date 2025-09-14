const express = require('express');
const { upgradeTenant } = require('../controllers/tenantController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.post('/:slug/upgrade', upgradeTenant);

module.exports = router;