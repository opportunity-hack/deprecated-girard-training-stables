const Lesson = require("../models/lessons");
const { getFormattedDateTime } = require("../utils/helper");
const { dataHandler } = require("../utils/responseHandler");

module.exports.createLesson = async function(req, res) {
  try {
    const lessonData = req.body;

    lessonData.startTime = getFormattedDateTime(new Date(), 'hh:mm');
    lessonData.endTime = getFormattedDateTime(new Date(), 'hh:mm');
    lessonData.bookedDates = [new Date()];

    const response = await Lesson.create(lessonData);
    return dataHandler({
        status: 201,
        data: response,
      },
      res
    );
  } catch (err) {
    return dataHandler(
      {
        status: 500,
        error: `Server error: ${err.message}.`
      },
      res
    );
  }
};
