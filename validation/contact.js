const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateContactInput(data) {
  let errors = {};
  data.name = !isEmpty(data.name) ? data.name : "";
  data.email = !isEmpty(data.email) ? data.email : "";
  data.message = !isEmpty(data.message) ? data.message : "";

  if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid!";
  }
  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field must not be empty";
  }
  if (Validator.isEmpty(data.name)) {
    errors.name = "Name field must not be empty";
  }
  if (Validator.isEmpty(data.message)) {
    errors.message = "Message must not be empty";
  }

  return { errors, isValid: isEmpty(errors) };
};
