const mongoose = require("mongoose");

function validateObjectId(id, res, statusCode = 400) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(statusCode).send({ message: "Invalid item ID format" });
    return false;
  }
  return true;
}

module.exports = validateObjectId;

// controlllers clothingItems.js
// const validateObjectId = require("../utils/validateObjectId");
