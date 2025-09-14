const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  subscription: {
    type: String,
    enum: ['free', 'pro'],
    default: 'free'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Tenant', tenantSchema);