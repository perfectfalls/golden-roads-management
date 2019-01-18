require("zone.js/dist/zone-node");
require("reflect-metadata");

const { enableProdMode } = require("@angular/core");

const express = require("express");
//import { join } from "path";
const mongoose = require("mongoose");
//import mongoose from "mongoose";
const passport = require("passport");
const bodyParser = require("body-parser");
const users = require("./routes/users");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const validateContactInput = require("./validation/contact");
const path = require("path");

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

const app = express();
const DIST_FOLDER = path.join(process.cwd(), "dist");
const {
  AppServerModuleNgFactory,
  LAZY_MODULE_MAP
} = require("./dist/server/main");

// Express Engine
const { ngExpressEngine } = require("@nguniversal/express-engine");
// Import module map for lazy loading
const {
  provideModuleMap
} = require("@nguniversal/module-map-ngfactory-loader");

app.engine(
  "html",
  ngExpressEngine({
    bootstrap: AppServerModuleNgFactory,
    providers: [provideModuleMap(LAZY_MODULE_MAP)]
  })
);
app.set("view engine", "html");
app.set("views", path.join(DIST_FOLDER, "golden-roads-capital"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//app.use("/", express.static(path.join(__dirname, "dist/golden-roads-capital")));

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//   );
//   next();
// });

mongoose
  .connect(process.env.MONGO_CONNECTION_STRING)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

app.use(passport.initialize());
require("./config/passport")(passport);

app.use("/api/users", users);

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

app.post("/api/contact", (req, res) => {
  const { errors, isValid } = validateContactInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const transport = setup();
  const message = {
    from: `${req.body.name} <${req.body.email}>`,
    to: "st.lucifer.avenue@gmail.com",
    subject: `New message from ${req.body.name}`,
    text: `${req.body.name} (${req.body.email}) says: ${req.body.message}`
  };
  transport.sendMail(message, (error, response) => {
    if (error) {
      res.status(400).json({ failure: "Message couldn't be sent, sorry!" });
    } else {
      res.json({ success: "Thank you for sending us your message" });
    }
  });
});

// Server static files from /browser
app.get("*.*", express.static(path.join(DIST_FOLDER, "golden-roads-capital")));
// All regular routes use the Universal engine
app.get("*", (req, res) => {
  res.render(path.join(DIST_FOLDER, "golden-roads-capital", "index.html"), {
    req
  });
});

// app.use((req, res, next) => {
//   res.sendFile(
//     path.join(__dirname, "dist", "golden-roads-capital", "index.html")
//   );
// });

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server running at ${port}`));
