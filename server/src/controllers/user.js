const asyncHandler = require('express-async-handler');
const User = require("../models/users");
const { dataHandler } = require("../utils/responseHandler");

module.exports.getUsers = asyncHandler(async function(req, res) {
  const response = await User.find({});
  res.status(200).json(response);
});

module.exports.createUser = asyncHandler(async function(req, res) {
    const response = await User.create(req.body);
    res.status(200).json(response);
});

module.exports.updateUser = async function(req, res) {
    const { id } = req.body;
    const response = await User.findOneAndUpdate({
       _id: id 
    },
      req.body,
      { new: true }
    );
};

