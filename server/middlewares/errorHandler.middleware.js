module.exports = (err, req, res, next) => {
  res.status(500).json({
    message: "Internal Server Error",
    error: err.message
  });
};
