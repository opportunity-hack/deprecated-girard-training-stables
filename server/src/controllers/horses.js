const asyncHandler = require('express-async-handler');
const Horse = require("../models/horses");
const { dataHandler } = require("../utils/responseHandler");

module.exports.createHorses = asyncHandler(async function(req, res) {
    const response = await Horse.insertMany(req.body);
    res.status(200).json(response);
});

module.exports.getHorses = asyncHandler(async function(req, res) {
    const response = await Horse.find({});
    res.status(200).json(response);
});

