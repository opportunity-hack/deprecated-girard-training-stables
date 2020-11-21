const { create } = require("../controllers/user");
// const { verifyId } = require("../utils/middlewares");

const express = require("express");
const userRouter = express.Router();

userRouter.post("/", create);
// userRouter.route("/:id").put(updateUser).get(getUser);

module.exports = userRouter;