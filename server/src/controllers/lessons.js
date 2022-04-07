const Lesson = require("../models/lessons");
const { getFormattedDateTime, convertTimeFormat } = require("../utils/helper");
const { dataHandler } = require("../utils/responseHandler");
const { sendLessonMail } = require("./../utils/emailer");

module.exports.createLesson = asyncHandler(async function(req, res) {
    const response = await Lesson.create(req.body);
    res.status(200).json(response);
    
    sendLessonMail({
      userEmail: 'developer.akash.s@gmail.com',
      name: 'Amy'
    });
});
