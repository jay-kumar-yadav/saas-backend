const Tenant = require('../models/Tenant');

// Upgrade tenant subscription
const upgradeTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.user.tenantId);
    
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    
    tenant.subscription = 'pro';
    await tenant.save();
    
    res.json({ message: 'Subscription upgraded to Pro successfully' });
  } catch (error) {
    console.error('Upgrade tenant error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { upgradeTenant };