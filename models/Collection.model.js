const mongoose = require("mongoose") 

const collectionSchema = new mongoose.Schema({
  title: String,
  description: String,
  img:String,
  owner: String,
  productos: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  }]
})

const Collection = mongoose.model("Collection", collectionSchema)

module.exports = Collection