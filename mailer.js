const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const jwt = require("jsonwebtoken");

const from = '"Golden Roads Capital" <info@goldenroadscapital.com>';

function setup() {
  return nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_user: process.env.sendgrid_username,
        api_key: process.env.sendgrid_password
      }
    })
  );
}

module.exports = {
  sendContactMessage: function(body, res) {
    const transport = setup();
    const message = {
      from: `${body.name} <${body.email}>`,
      to: "st.lucifer.avenue@gmail.com",
      subject: `New message from ${body.name}`,
      text: `${body.name} (${req.body.email}) says: ${body.message}`
    };
    transport.sendMail(message, (error, response) => {
      if (error) {
        res.status(400).json({ failure: "Message couldn't be sent, sorry!" });
      } else {
        res.json({ success: "Thank you for sending us your message" });
      }
    });
  },

  sendConfirmationEmail: function(user) {
    const tranport = setup();
    const email = {
      from,
      to: user.email,
      subject: "Welcome to Golden Roads Capital",
      text: `
      Welcome to Golden Roads Capital. Please, confirm your email.
  
      ${user.generateConfirmationUrl()}
      `
    };

    tranport.sendMail(email);
  },
  sendResetPasswordEmail: function(user) {
    const resetPasswordToken = jwt.sign(
      { _id: user._id },
      process.env.JWT_KEY,
      {
        expiresIn: "2h"
      }
    );
    const resetPasswordLink = `${
      process.env.hostUri
    }/reset_password/${resetPasswordToken}`;
    const tranport = setup();
    const email = {
      from,
      to: user.email,
      subject: "Reset Password",
      text: `
      To reset password follow this link
  
      ${resetPasswordLink}
      `
    };

    tranport.sendMail(email);
  }
};
