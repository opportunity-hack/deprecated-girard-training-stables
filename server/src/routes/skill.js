const { 
  createSkills, 
  createPositions, 
  getAllPositions, 
  getAllSkills, 
  getAllPositionsBySkills
} = require('../controllers/skills');
const { createHorses } = require('../controllers/horses');

const express = require('express');
const { createLesson } = require('../controllers/lessons');
const skillRouter = express.Router();

// skillRouter.get('/skills/')

skillRouter.route('/skills')
.get(getAllSkills)
.post(createSkills);

skillRouter.post('/positions/getBySkills', getAllPositionsBySkills);

skillRouter.route('/positions')
.get(getAllPositions)
.post(createPositions);

skillRouter.route('/horses')
.post(createHorses)

skillRouter.route('/lessons')
.post(createLesson)

module.exports = skillRouter;