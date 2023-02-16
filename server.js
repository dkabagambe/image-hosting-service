const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path"); //core node module,thats why i didnt install it
const imageModel = require("./models/model");
const ejs = require("ejs");
require("dotenv").config(); // load environment variables from .env file

// intitalize express
const app = express();
//set view engine
app.set("view engine", ejs);
//connect to the database
mongoose.connect(
  process.env.DATABASE_URI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  function (err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Successfully connected to the database");
    }
  }
);
// setup  storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Construct the destination path based on your requirements
    const destination = "public/uploads/";
    cb(null, destination);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

//we need to itialize the upload variable
const upload = multer({ storage: storage }).single("dbimages");

//express.static is a middleware function provided by Express.js that serves static files, such as HTML, CSS, and JavaScript, in the response to HTTP requests.
app.use(express.static("public"));
//first use the get router and see
app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.post("/upload", (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      res.render("index.ejs", { msg: err });
    } else {
      const newImage = new imageModel({
        imageName: req.file.filename,
        imageData: req.file.path,
      });
      newImage.save((err, doc) => {
        if (err) {
          console.log(err);
          res.send(err);
        } else {
          console.log(doc);
          res.send("Your file has been uploaded to the database");
        }
      });
    }
  });
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`server started on port ${port}`);
});
