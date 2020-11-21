const mongoose = require("./db/connector");

const positionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  skills: [{
    name: {
      type: String,
      required: true 
    },
    YOE: mongoose.Schema.Types.Decimal128
  }],
});

const Position = mongoose.model("Position", positionSchema);
module.exports = Position;