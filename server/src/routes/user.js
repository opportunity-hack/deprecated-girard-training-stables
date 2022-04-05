const { 
  create, 
  update 
} = require("../controllers/user");
// const { verifyId } = require("../utils/middlewares");

const express = require("express");
const router = require('express').Router();

router.route("/")
.post(create)
.put(update)

module.exports = router;