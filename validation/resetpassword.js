const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = {
  validateResPassReqInput: data => {
    let errors = {};
    data.email = !isEmpty(data.email) ? data.email : "";

    if (!Validator.isEmail(data.email)) {
      errors.email = "Email is invalid!";
    }
    if (Validator.isEmpty(data.email)) {
      errors.email = "Email field must not be empty";
    }

    return { errors, isValid: isEmpty(errors) };
  },
  validateResetPasswordInput: data => {
    let errors = {};

    if (!Validator.isLength(data.password, { min: 6, max: 30 })) {
      errors.password = "Password must be at least 6 characters long";
    }
    if (Validator.isEmpty(data.password)) {
      errors.password = "Password field must not be empty";
    }
    if (Validator.isEmpty(data.password2)) {
      errors.password2 = "Confirm password field must not be empty";
    }
    if (!Validator.equals(data.password, data.password2)) {
      errors.password2 = "Confirm password did not match password";
    }

    return { errors, isValid: isEmpty(errors) };
  }
};
