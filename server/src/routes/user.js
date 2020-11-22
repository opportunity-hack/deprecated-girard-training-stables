const { create, update } = require("../controllers/user");
// const { verifyId } = require("../utils/middlewares");

const express = require("express");
const userRouter = express.Router();

userRouter.post("/", create);
userRouter.route("/:id")
.put(update)
// .get(getUser);

module.exports = userRouter;