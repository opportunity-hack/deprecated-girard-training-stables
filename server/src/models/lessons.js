const mongoose = require("./db/connector");
const Horse = require("./horses");
const User = require("./users");

const lessonSchema = new mongoose.Schema({
  startDateTime: {
    type: Date,
    required: true
  },
  endDateTime: {
    type: Date,
    required: true
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: true,
  },
  volunteers: {
    "barnCrew" : {
      required: Number,
      signedUp: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      }]
    },
    "lessonAssistent" : {
      required: Number,
      signedUp: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      }]
    },
    "sideWalker" : {
      required: Number,
      signedUp: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
      }]
    },
    "horseLeader" : {
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

const Lesson = mongoose.model("Lesson", lessonSchema);
module.exports = Lesson;