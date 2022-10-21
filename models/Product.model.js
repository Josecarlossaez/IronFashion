const mongoose = require("mongoose")

const productSchema = new mongoose.Schema ({
  name: String,
  cost: Number,
  description: String,
  type: String,
  img: String 
})

const Product = mongoose.model("Product", productSchema)

module.exports = Product
