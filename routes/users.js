const express = require("express");
const User = require("../models/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const {
  validateResPassReqInput,
  validateResetPasswordInput
} = require("../validation/resetpassword");
const mailer = require("../mailer");
const router = express.Router();

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password
      });
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          const confirmationToken = jwt.sign(
            {
              name: newUser.name,
              avatar: newUser.avatar,
              confirmed: newUser.confirmed
            },
            process.env.JWT_KEY
          );
          newUser.confirmationToken = confirmationToken;
          newUser
            .save()
            .then(user => {
              mailer.sendConfirmationEmail(user);
              const payload = {
                name: user.name,
                avatar: user.avatar,
                confirmed: user.confirmed
              };
              jwt.sign(
                payload,
                process.env.JWT_KEY,
                { expiresIn: 7200 },
                (err, token) => {
                  res.json({ success: true, token: "Bearer " + token });
                }
              );
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post("/confirmation", (req, res) => {
  const token = req.body.token;
  User.findOneAndUpdate(
    { confirmationToken: token },
    { confirmationToken: "", confirmed: true },
    { new: true }
  ).then(user => {
    if (user) {
      const payload = {
        name: user.name,
        avatar: user.avatar,
        confirmed: user.confirmed
      };
      jwt.sign(
        payload,
        process.env.JWT_KEY,
        { expiresIn: 7200 },
        (err, token) => {
          res.json({ success: true, token: "Bearer " + token });
        }
      );
    } else {
      res.status(400).json({ error: "User could not be found or confirmed!" });
    }
  });
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;
  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "No such user exists!";
      return res.status(404).json(errors);
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          name: user.name,
          avatar: user.avatar,
          confirmed: user.confirmed
        };
        jwt.sign(
          payload,
          process.env.JWT_KEY,
          { expiresIn: 7200 },
          (err, token) => {
            res.json({ success: true, token: "Bearer " + token });
          }
        );
      } else {
        errors.password = "Incorrect username or password!";
        return res.status(400).json(errors);
      }
    });
  });
});

router.post("/reset_password_request", (req, res) => {
  const errors = {};
  errors = validateResPassReqInput(req.body).errors;
  const { isValid } = validateResPassReqInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      mailer.sendResetPasswordEmail(user);
      res.json({ success: "An email has been sent to you" });
    } else {
      errors.global = "There is no user with such email";
      res.status(400).json(errors);
    }
  });
});

router.post("/validate_token", (req, res) => {
  jwt.verify(req.body.token, process.env.JWT_KEY, err => {
    if (err) {
      res.status(401).json({ validated: "yes" });
    } else {
      res.json({ global: "Invalid token" });
    }
  });
});

router.post("/reset_password", (req, res) => {
  const errors = {};
  errors = validateResetPasswordInput(req.body).errors;
  const { isValid } = validateResetPasswordInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { password, token } = req.body;
  jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
    if (err) {
      errors.global = "Invalid token";
      res.status(401).json(errors);
    } else {
      User.findOne({ _id: decoded._id }).then(user => {
        if (user) {
          bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              user.password = hash;
              user
                .save()
                .then(() =>
                  res.json({ success: "Your password was successfully reset!" })
                );
            });
          });
        } else {
          errors.global = "Invalid token";
          res.status(404).json(errors);
        }
      });
    }
  });
});

module.exports = router;
