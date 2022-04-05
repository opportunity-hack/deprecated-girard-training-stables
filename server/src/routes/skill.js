const { 
  createSkills, 
  getAllSkills, 
} = require('../controllers/skills');

const express = require('express');

const router = require('express').Router();

// skillRouter.get('/skills/')

router.route('/')
.get(getAllSkills)
.post(createSkills);

module.exports = router;