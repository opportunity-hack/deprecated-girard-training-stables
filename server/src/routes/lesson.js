const express = require('express');
const { createLesson } = require('../controllers/lessons');
const router = require('express').Router();

router.route('/')
.post(createLesson)

module.exports = router;