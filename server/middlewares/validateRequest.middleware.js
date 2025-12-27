module.exports = (req, res, next) => {
  const { source, destination } = req.query;

  if (!source || !destination) {
    return res.status(400).json({
      message: "Source and destination are required"
    });
  }
  next();
};
