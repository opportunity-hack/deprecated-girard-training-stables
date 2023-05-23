const asyncHandler = require('express-async-handler');
const User = require("../models/users");
const { dataHandler } = require("../utils/responseHandler");
const mongoose = require("mongoose");
const { httpClient } = require("../utils/httpClient");

const auth0ApiUrl = `https://${process.env.AUTH0_DOMAIN}/api/v2`
const auth0usersEndpoint = `${auth0ApiUrl}/users`;
const auth0adminUsersEndpoint = `${auth0ApiUrl}/roles/${process.env.AUTH0_ADMIN_ROLE_ID}/users`;

module.exports.getUsers = asyncHandler(async function(req, res) {
    console.log("something hit the /get users endpoint")
    const auth0UserPromise = httpClient.get(auth0usersEndpoint)
    const adminUsersPromise = httpClient.get(auth0adminUsersEndpoint)
    let auth0usersResp;
    let adminUsersResp;
    try {
        [auth0usersResp, adminUsersResp] = await Promise.all(
        [auth0UserPromise,
         adminUsersPromise])
    } catch (err) {
        res.status(500)
        throw err
    }
    // we use the lean option here to get plain javascript objects from 
    // the query rather than mongoose documents
    let users = await User.find(req.query).lean()
    let userMap = {};
    users.map(user => userMap[user.user_id] = user)
    auth0usersResp.data.map(user => {
        if (user.user_id in userMap) {
            userMap[user.user_id].last_login = user.last_login
        }
    })
    adminUsersResp.data.map(user => {
        if (user.user_id in userMap) {
            userMap[user.user_id].isAdmin = true
        }
    })
    const response = Object.values(userMap)

    res.status(200).json(response);
});

module.exports.createUser = asyncHandler(async function(req, res) {
  const auth0CreateResp = await httpClient.post(auth0usersEndpoint, req.body)
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

module.exports.updateUserById = asyncHandler(async function(req, res) {
    const id = await User.findById(req.params.id)
    if (!id)
    {
      res.status(400);
      throw new Error("User not found")
    }
    const response = await User.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json(response);
});

module.exports.deleteUserById = asyncHandler(async function(req, res) {
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

