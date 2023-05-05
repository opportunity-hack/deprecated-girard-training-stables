const Lesson = require("../models/lessons");
const { getFormattedDateTime, convertTimeFormat } = require("../utils/helper");
const { dataHandler } = require("../utils/responseHandler");
const { sendRegisterLessonMail, sendUnRegisterLessonMail, sendUnregisterLessonMail } = require("./../utils/emailer");
const asyncHandler = require('express-async-handler');

module.exports.createLesson = asyncHandler(async function(req, res) {
    console.log("started creating lesson");
    // log body
    console.log("req.body:", req.body);
    
    const response = await Lesson.create({
      start: req.body.start,
      end: req.body.end,
      instructor: req.body.instructor,
      volunteers: req.body.volunteers,
      horses: req.body.horses,
      notes: req.body.notes,
      title: req.body.title
    })
    res.status(200).json(response);
});

module.exports.getLesson = asyncHandler(async function(req, res) {
  const response = await Lesson.find({});
  res.status(200).json(response);
});

module.exports.updateLesson = asyncHandler(async function(req, res) {
  const id = await Lesson.findById(req.params.id)

  if (!id) {
    res.status(400);
    throw new Error("Lesson not found")
  }

  const response = await Lesson.findByIdAndUpdate(req.params.id, req.body.data, {new: true});
  if (req.query.signedUp == 'true' && req.body.email)
  {
    sendRegisterLessonMail({
      lessonName: response.title,
      userEmail: req.body.email,
      name: req.body.email.split('@')[0]
    });
  }
  else if (req.query.signedUp == 'false' && req.body.email)
  {
    sendUnregisterLessonMail({
      lessonName: response.title,
      userEmail: req.body.email,
      name: req.body.email.split('@')[0]
    })
  }
  console.log(AuthenticatorResponse)
  res.status(200).json(response);
});

module.exports.deleteLesson = asyncHandler(async function(req, res) {
  const id = await Lesson.findById(req.params.id);

  if (!id) {
      res.status(400);
      throw new Error("Lesson not found");
  }
  
  await id.delete();
  res.status(200).json({ id: req.params.id });
});