// This loads the .env file into the project

const JWT_SECRET = process.env.JWT_SECRET || "secret-value-to-avoid-errors";

module.exports = {
  JWT_SECRET,
};
