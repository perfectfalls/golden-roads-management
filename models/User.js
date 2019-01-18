const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String
  },
  confirmed: { type: Boolean, default: false },
  confirmationToken: { type: String, default: "" },
  date: {
    type: Date,
    default: Date.now()
  }
});

UserSchema.methods.generateConfirmationUrl = function generateConfirmationUrl() {
  return `${process.env.hostUri}/confirmation/${this.confirmationToken}`;
};

const User = mongoose.model("users", UserSchema);

module.exports = User;
