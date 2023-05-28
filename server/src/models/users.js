const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

if (process.env.NODE_ENV !== "production") {
    const dotenv = require("dotenv")
    dotenv.config()
}

const auth0ApiUrl = `https://${process.env.AUTH0_DOMAIN}/api/v2`
const auth0usersEndpoint = `${auth0ApiUrl}/users`;
const auth0adminUsersEndpoint = `${auth0ApiUrl}/roles/${process.env.AUTH0_ADMIN_ROLE_ID}/users`;

const { httpClient } = require('../utils/httpClient')

const userSchema = new mongoose.Schema({
  // The auth0 id associated with a user. 
  // This is different from the _id ObjectID
  // used by mongoose
  user_id: {
      type: String,
      required: true,
      unique: true,
      immutable: true,
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  userType: {
    type: String,
    enum: ['instructor', 'volunteer', 'volunteer coordinator'],
    required: true,
    default: "volunteer"
  },
  email: {
    type: String,
    required: [true, "Please provide username"],
    unique: true,
    match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    "Please provide a valid email"]
  },
  phoneNumber: {
    type: String,
    required: false,
    match: [/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, "Please provide a valid phone number"]
  },
  // in inches
  height: {
    type: Number,
    min: 1,
  },
  age: {
    type: Number,
    min: 1,
  },
  horseExperience: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
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

userSchema.pre('deleteOne', {document: true, query: false}, async function(next) {
    try {
        await httpClient.delete(auth0usersEndpoint + '/' + this.user_id)
    } catch(err) {
        throw err
    }
    next()
});

const User = mongoose.model('User', userSchema);
module.exports = User;
