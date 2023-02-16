const mongoose = require("mongoose");
const imageSchema = new mongoose.Schema({
  imageName: String,
  imageData: String,
});

const ImageModel = mongoose.model("imageModel", imageSchema);
module.exports = ImageModel;
