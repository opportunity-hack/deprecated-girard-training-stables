const Position = require("../models/positions");
const Skill = require("../models/skills");
const { dataHandler } = require("../utils/responseHandler");

module.exports.createSkills = async function(req, res) {
  try {
    const response = await Skill.insertMany(req.body);
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

module.exports.getAllSkills = async function(req, res) {
  try {
    const response = await Skill.find({});
    
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

module.exports.getAllPositions = async function(req, res) {
  try {
    const response = await Position.find({});

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

module.exports.createPositions = async function(req, res) {
  try {
    const response = await Position.insertMany(req.body);
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

