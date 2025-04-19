const mongoose = require('mongoose');

const unitSchema = new mongoose.Schema({
  languageId: {
    type: String,
    ref: 'languages',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  order: {
    type: Number,
    required: true
  },
  iconUrl: {
    type: String,
    default: null
  },
  requiredExperience: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Unit = mongoose.model('units', unitSchema);

module.exports = Unit;
