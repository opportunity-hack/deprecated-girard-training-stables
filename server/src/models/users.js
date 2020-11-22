const mongoose = require("./db/connector");
const UserType = require("./UserTypes");
// const Lesson = require("./lessons");

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
  skills: [{type: String}]
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