const mongoose = require("mongoose")

const productSchema = new mongoose.Schema ({
  productType: String,
  cost: Number,
  description: String,
  temporada: String,
  size:String,
  img: String,
  color:String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }  
  
})

const Product = mongoose.model("Product", productSchema)

module.exports = Product
