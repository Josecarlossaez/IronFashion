const mongoose = require("mongoose")


// BOOOOOOOOOOOOOOOOOOOOOONNNNUUUUUUUUUUUUUUUUUUUUUUUUUUUUUS
const blogSchema = new mongoose.Schema ({
  title: String,
  description: String,
  img: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
  }
})

const Blog = mongoose.model("Blog", blogSchema)

module.exports = Blog