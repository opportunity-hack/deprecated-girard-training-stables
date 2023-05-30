const asyncHandler = require('express-async-handler');
const User = require("../models/users");
const { dataHandler } = require("../utils/responseHandler");
const mongoose = require("mongoose");
const { httpClient } = require("../utils/httpClient");

const auth0ApiUrl = `https://${process.env.AUTH0_DOMAIN}/api/v2`
const auth0usersEndpoint = `${auth0ApiUrl}/users`;
const auth0adminUsersEndpoint = `${auth0ApiUrl}/roles/${process.env.AUTH0_ADMIN_ROLE_ID}/users`;

module.exports.getUsers = asyncHandler(async function(req, res, next) {
    const auth0UserPromise = httpClient.get(auth0usersEndpoint)
    const adminUsersPromise = httpClient.get(auth0adminUsersEndpoint)
    let auth0usersResp;
    let adminUsersResp;
    try {
        [auth0usersResp, adminUsersResp] = await Promise.all(
        [auth0UserPromise,
         adminUsersPromise])
    } catch (err) {
        next(err)
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

module.exports.createUser = asyncHandler(async function(req, res, next) {
  try {
    await httpClient.post(auth0usersEndpoint, req.body)
  } catch(err) {
    next(err)
  }
  try {
      const response = await User.create(req.body);
      res.status(201).json(response);
  } catch(err) {
      if (err instanceof mongoose.Error.ValidationError) {
          res.status(400).json(err.errors);
      }
      else {
          next(err)
      }
  }
});

module.exports.updateUserById = asyncHandler(async function(req, res, next) {
    const user = await User.findById(req.params.id)
    if (!user) {
      res.status(400).json({
        error: "User not found"
      });
    }

    try {
        if ("setAdmin" in req.body) {
            if (req.body.setAdmin === true) {
                await httpClient.post(
                `${auth0usersEndpoint}/${user.user_id}/roles`,
                {roles: [process.env.AUTH0_ADMIN_ROLE_ID]})
            } else {
                // the 2nd parameter to axios.delete is axios options, not
                // a request body like in axios.post or axios.put
                await httpClient.delete(
                `${auth0usersEndpoint}/${user.user_id}/roles`,
                    { data: {roles: [process.env.AUTH0_ADMIN_ROLE_ID]} })
            }
        }
        user.set(req.body);
        if (user.modifiedPaths().includes("email")) {
            await httpClient.patch(
                `${auth0usersEndpoint}/${user.user_id}`,
                { email: user.email }
            )
        }
        await user.save();
        res.status(200).json(user);

    } catch(err) {

      if (err instanceof mongoose.Error.ValidationError) {
          res.status(400).json(err.errors);
      }
      next(err)
    }
});

module.exports.deleteUserById = asyncHandler(async function(req, res, next) {
  const user = await User.findById(req.params.id);

  if (!user)
  {
      res.status(400).json({
          error: "no user with specified id"
      });
  }

  await user.deleteOne();
  res.status(200).json({ message: `deleted user ${req.params.id}` });
});

