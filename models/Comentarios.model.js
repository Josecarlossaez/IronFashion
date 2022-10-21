const mongoose = require("mongoose")

const comentariosSchema = new mongoose.Schema ({
  title: String, 
  description: String,
  date: new Date() //! ¿esto se pone asi?
})

const Comentarios = mongoose.model("Comenatios", comentariosSchema)

module.exports = Comentarios