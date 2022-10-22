const express = require('express');
const router = express.Router();
const Product = require("../models/Product.model.js")

//GET  ("/product/create") ruta para visualizar la página para crear un producto
router.get("/create", (req, res, next) => {
  res.render("product/create.hbs")
});

// POST ("/product/create") ruta para crear un producto
router.post("/create", async(req, res, next) => {
   const{name, cost, description, type,img} = req.body
  try{
   
    const productToAdd ={name,cost,description,type,img}
    await Product.create(productToAdd);
    res.redirect("/list")

  }catch (err){
    next(err)
  }
})

//GET ("/produtct/list")ruta donde el admin puede ver todos los productos
router.get("/list", (req, res, next) => {

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

// GET ("/product/:productId/details")
router.get("/:productId/details",  (req, res, next) => {
  const {productId} = req.params;

   Product.findById(productId)
   .then((response) => {
     res.render("product/details.hbs", {
      productDetails:response
    })

   }).catch((err)=>{
    next(err)
   })
   

})

module.exports = router;