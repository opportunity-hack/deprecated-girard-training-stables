const mongoose = require('mongoose');
const Horse = require('./horses');
const User = require('./users');

const lessonSchema = new mongoose.Schema({
  // store dates in UTC timezone  
  startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    bookedDates: [{
      type: Date,
      required: true,
      default: new Date()
    }],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: User,
      required: true,
    },
    volunteers: {
      "barn crew" : {
        required: Number,
        signedUp: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: User,
        }]
      },
      "pasture crew" : {
        required: Number,
        signedUp: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: User,
        }]
      },
      "lesson assistant" : {
        required: Number,
        signedUp: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: User,
        }]
      },
      "sidewalker" : {
        required: Number,
        signedUp: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: User,
        }]
      },
      "horse leader" : {
        required: Number,
        signedUp: [{
          type: mongoose.Schema.Types.ObjectId,
          ref: User,
        }]
      },
    },
    horses: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: Horse,
    }],
    notes: String
  });

const Lesson = mongoose.model('Lesson', lessonSchema);
module.exports = Lesson;