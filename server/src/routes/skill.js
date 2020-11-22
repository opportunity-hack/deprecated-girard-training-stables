const { 
  createSkills, 
  createPositions, 
  getAllPositions, 
  getAllSkills, 
  getAllPositionsBySkills
} = require("../controllers/skills");

const express = require("express");
const skillRouter = express.Router();

skillRouter.get("/skills/g")
skillRouter.route("/skills")
.get(getAllSkills)
.post(createSkills);

skillRouter.post("/positions/getBySkills", getAllPositionsBySkills);

skillRouter.route("/positions")
.get(getAllPositions)
.post(createPositions);

module.exports = skillRouter;