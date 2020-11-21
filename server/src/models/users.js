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
  },
  userType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: UserType,
    required: true
  },
  height: {
    type: Number,
  },
  phoneNumber: {
    type: Number
  },
  age: {
    type: Number
  },
  // lessonsSubscribed: [{ 
  //   lesson: {
  //     type: mongoose.Schema.Types.ObjectId,
  //     ref: Lesson,
  //     required: true
  //   },
  //   startDateTime: Date,
  //   endDateTime: Date,
  // }]
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