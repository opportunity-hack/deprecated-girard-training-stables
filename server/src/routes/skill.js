const { 
  createSkills, 
  createPositions, 
  getAllPositions, 
  getAllSkills 
} = require("../controllers/skills");

const express = require("express");
const skillRouter = express.Router();

skillRouter.route("/skills")
.get(getAllSkills)
.post(createSkills);

skillRouter.route("/positions")
.get(getAllPositions)
.post(createPositions);

module.exports = skillRouter;