const mongoose = require("./db/connector");
const Skill = require("./skills");
const UserType = require("./UserTypes");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastNAme: {
    type: String,
    required: false
  },
  userType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserType,
    required: true
  },
  emailId: {type:String, required: true},
  height: {
    type: Number,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  DOB: {
    type: Date
  },
  skills: [{
    type: mongoose.Types.ObjectId,
    ref: Skill
  }]
});

// userSchema.method("toClient", function() {
//   var obj = this.toObject();
//   //Rename fields
//   obj.id = obj._id;
//   delete obj._id;
//   delete obj.__v;
//   delete obj.password;
//   return obj;
// });

const User = mongoose.model("User", userSchema);
module.exports = User;