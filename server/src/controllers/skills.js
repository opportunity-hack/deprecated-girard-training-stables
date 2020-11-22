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
        status: 200,
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
        status: 200,
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

module.exports.getAllPositionsBySkills = async function(req, res) {
  try {
    const skillsListToCheck = req.body;
    console.log(`requested skills ${skillsListToCheck}`);
    const allVolPositions = await Position.find({});

    const positionGoodToVol = [];
    
    for (let pos of allVolPositions) {
      console.log(`checking for ${pos['name']} with ${pos["skills"]}`);

      const isAllSkillsMatched = (pos["skills"].filter(value => skillsListToCheck.includes(value.toString())).length == pos["skills"].length) ? true: false;
      

      if(isAllSkillsMatched) {
        positionGoodToVol.push({name: pos["name"],id: pos["_id"]});
      }
    }

    return dataHandler({
        status: 200,
        data: positionGoodToVol,
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

