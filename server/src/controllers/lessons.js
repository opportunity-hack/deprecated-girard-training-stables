const Lesson = require("../models/lessons");
const { dataHandler } = require("../utils/responseHandler");

module.exports.createLesson = async function(req, res) {
  try {
    const response = await Lesson.create(req.body);
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
