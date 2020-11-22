const express = require("express");
const userRouter = require("./user");
const skillRouter = require("./skill");

const router = express.Router();

router.use("/users", userRouter);

router.use("/api", skillRouter);

module.exports = router;