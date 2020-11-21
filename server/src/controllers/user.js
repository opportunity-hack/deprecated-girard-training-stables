const User = require("../models/users");
const { dataHandler } = require("../utils/responseHandler");
// const { generateRandomUser } = require("../utils/seed-generator");

module.exports.create = async function(req, res) {
  try {
    const response = await User.create(req.body);
    console.log("object");
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