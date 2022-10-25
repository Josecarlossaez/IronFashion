const express = require('express');
const router = express.Router();
const Product = require("../models/Product.model.js")
const uploader = require("../middlewares/cloudinary.js");
const { isAdmin, isLoggedIn } = require('../middlewares/auth.middlewares.js');

//GET  ("/product/create") ruta para visualizar la página para crear un producto
router.get("/create", isAdmin,(req, res, next) => {
  res.render("product/create.hbs")
});

// POST ("/product/create") ruta para crear un producto
router.post("/create",uploader.single("img"),  isAdmin, async(req, res, next) => {
   const{productType, cost, description, temporada, size, color} = req.body
   
  try{
   
    const productToAdd ={productType,cost,description,temporada,size,img: req.file.path,color}
    await Product.create(productToAdd);
    res.redirect("/product/list")

  }catch (err){
    next(err)
  }
})

//GET ("/produtct/list")ruta donde el admin puede ver todos los productos
router.get("/list", isLoggedIn, (req, res, next) => {

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
router.get("/:productId/details", isLoggedIn, (req, res, next) => {
  const {productId} = req.params;

   Product.findById(productId)
   .then((response) => {
    console.log(response)
     res.render("product/details.hbs", {
      productDetails:response
    })

   }).catch((err)=>{
    next(err)
   })
   

});

//GET ("/product/:productId/edit-form")
router.get("/:productId/edit-form", isAdmin, (req,res,next) => {
const{productId} = req.params
Product.findById(productId)
.then((product) => {
res.render("product/edit-form.hbs",{
  productDetails : product
})
})
.catch ((err) => {
  next(err)
})
});

//POST ("/product/:productId/edit-form")
router.post("/:productId/edit-form",  isAdmin, (req,res,next) => {
  const{productId} = req.params
  const{productType,cost,description,temporada,size,img,color} = req.body
  const editProduct ={productType,cost,description,temporada,size,img,color}
  Product.findByIdAndUpdate(productId , editProduct)
  .then(() => {
    res.redirect("/product/list")
  })
.catch((err) => {
  next(err)
})
});

//POST ("/product/:productId/delete")
router.post("/:productId/delete",  isAdmin, (req, res, next) => {
  Product.findByIdAndDelete(req.params.productId)
  .then(() => {
    res.redirect("/product/list")
  })
  .catch((err) => {
    next(err)
  })
})

module.exports = router;