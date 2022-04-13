const jwt = require("jsonwebtoken");

module.exports = {
  sign: (data) => jwt.sign(data, "SECRET_KEY"),
  verify: (data) => jwt.verify(data, "SECRET_KEY"),
};