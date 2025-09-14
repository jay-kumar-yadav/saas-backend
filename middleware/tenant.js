const Note = require('../models/Note');
const Tenant = require('../models/Tenant');

const checkNoteLimit = async (req, res, next) => {
  try {
    // Get the tenant information first
    const tenant = await Tenant.findById(req.user.tenantId);
    
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    // Store tenant in request for later use
    req.tenant = tenant;
    
    if (tenant.subscription === 'pro') {
      return next();
    }
    
    const noteCount = await Note.countDocuments({ tenantId: req.user.tenantId });
    
    if (noteCount >= 3) {
      return res.status(403).json({ 
        message: 'Free plan limit reached. Upgrade to Pro to create more notes.' 
      });
    }
    
    next();
  } catch (error) {
    console.error('Note limit check error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { checkNoteLimit };