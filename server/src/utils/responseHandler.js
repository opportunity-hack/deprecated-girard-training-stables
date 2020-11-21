module.exports.dataHandler = function({ data, status, error }, res) {
  const resStatus = status || 200;
  return res.status(resStatus).json({
    data: data,
    error: error
  });
};