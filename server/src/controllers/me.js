const asyncHandler = require('express-async-handler');
const User = require("../models/users");
const mongoose = require("mongoose");
const { UnauthorizedError } = require ("express-oauth2-jwt-bearer")

// Auth0 middleware adds properties to req.auth on successful authorization.
// We use these to check the identity of the user and only authorize operations on the
// entity in the User model that belongs to them.
//
// Reference: https://auth0.github.io/node-oauth2-jwt-bearer/interfaces/JWTPayload.html

module.exports.getMe = asyncHandler(async function(req, res) {
  const user_id = req.auth?.payload?.sub;
  if (user_id) {
      const response = await User.find({ user_id: user_id })
      res.status(200).json(response);
  } else {
      throw new Error("No user_id provided")
  }
});

module.exports.createMe = asyncHandler(async function(req, res) {
  const user_id = req.auth?.payload?.sub;
  if (req.body.user_id !== user_id) {
    throw new UnauthorizedError();
  }
  try {
      const response = await User.create(req.body);
      res.status(201).json(response);
  } catch(err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json(err.errors);
    } else {
      throw err
    }
  }
});

module.exports.updateMe = asyncHandler(async function(req, res) {
    const user_id = req.auth?.payload?.sub;
    try {
        const response = await User.findOneAndUpdate({ user_id: user_id}, req.body, {new: true});
        res.status(200).json(response);
    } catch(err) {
        throw err
    }
});

module.exports.deleteMe = asyncHandler(async function(req, res) {
  const user_id = req.auth?.payload?.sub;
  try {
      const response = await User.findOneAndDelete({ user_id: user_id})
      res.status(200).json(response);
  } catch(err) {
      throw err
  }
});

