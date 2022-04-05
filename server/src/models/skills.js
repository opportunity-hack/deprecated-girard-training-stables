const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  // lesson assistant and horse lead positions require 1+ years of exp
  horseExperience: {
    type: Number,
    required: true,
    default: 0
  },
  horseRiding: {
    type: Boolean
  },
  horseTacking: {
    type: Boolean
  },
  horseGrooming: {
    type: Boolean
  },
  horseLeading: {
    type: Boolean
  }
});

const Skill = mongoose.model('Skill', skillSchema);
module.exports = Skill;