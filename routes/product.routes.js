const express = require('express');
const router = express.Router();
const Product = require("../models/Product.model.js")

//GET ruta para crear un producto
router.get("/create", (req, res, next) => {
  res.render("product/create.hbs")
})

//GET ruta donde el admin puede ver todos los productos
router.get("/", (req, res, next) => {

  Product.find()
  .then((listProduct) => {
    res.render("product/list.hbs", {
      listProduct
    })
  })
  .catch((err) => {
    next(err)
  })

})

module.exports = router;