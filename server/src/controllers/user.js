const asyncHandler = require('express-async-handler');
const User = require("../models/users");
const { dataHandler } = require("../utils/responseHandler");

module.exports.getUsers = asyncHandler(async function(req, res) {
  let email = req.query.email;
  var response;
  
  if (email) 
  {
    response = await User.findOne({ email: email});
  }
  else
  {
    response = await User.find({});
  }
  res.status(200).json(response);
});

module.exports.createUser = asyncHandler(async function(req, res) {
  console.log("starting to create user");
  //console.log("req:", req);
  console.log("req.body:", req.body);
    const response = await User.create(req.body);
    res.status(201).json(response);
  console.log("finished creating user");
});

module.exports.updateUser = asyncHandler(async function(req, res) {
    const id = await User.findById(req.params.id)

    if (!id)
    {
      res.status(400);
      throw new Error("User not found")
    }

    const response = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json(response);

    // old code
    // const { id } = req.body;
    // const response = await User.findOneAndUpdate({
    //    _id: id 
    // },
    //   req.body,
    //   { new: true }
    // );
});

module.exports.deleteUser = asyncHandler(async function(req, res) {
  const id = await User.findById(req.params.id);

  if (!id)
  {
      res.status(400);
      throw new Error("User not found");
  }

  // no need to save response since we are deleting
  await id.delete();
  res.status(200).json({ id: req.params.id });
});

