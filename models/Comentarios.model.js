const mongoose = require("mongoose")

const comentariosSchema = new mongoose.Schema ({
  title: String, 
  description: {
    type: String
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  } 
},
{
  timestamps: true
}
);

const Comentarios = mongoose.model("Comentarios", comentariosSchema)

module.exports = Comentarios