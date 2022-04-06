const { 
  getUsers,
  createUser, 
  updateUser 
} = require("../controllers/user");
const express = require("express");
const router = require('express').Router();

router.route("/").get(getUsers)
.post(createUser)
.put(updateUser)

module.exports = router;