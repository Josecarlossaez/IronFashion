const express = require('express');
const router = express.Router();
const Product = require("../models/Product.model.js")
const uploader = require("../middlewares/cloudinary.js");
const { isAdmin, isLoggedIn } = require('../middlewares/auth.middlewares.js');
const Comentarios = require("../models/Comentarios.model.js")
const User = require("../models/User.model.js")

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
router.get("/:productId/details", isLoggedIn, async (req, res, next) => {
  const {productId} = req.params;
  const userId = req.session.activeUser._id
  
  try {
    const productDetails = await Product.findById(productId)  //.populate("owner")
    console.log("Detalles del producto:", productDetails)

    const commentDetails = await Comentarios.find({product: productId}).populate("owner", "username") 
    console.log("Detalles de commentDetails:", commentDetails)   
    
    res.render ("product/details.hbs", {
      productDetails,
      commentDetails   
    })
    
  } catch (error) {
    next(error)
  }
   

});

//POST ("/product/:productId/details")
router.post("/:productId/details/add-comment", isLoggedIn, async (req, res, next) => {
  const{productId} = req.params
  const userId = req.session.activeUser._id
  const {title, description, owner, product} = req.body
  console.log(req.body.title)
  console.log(req.body.description)
  console.log(productId)
  console.log(userId)
  
  try {
    
    const editComentarios = {
      title,
      description,
      owner: userId,
      product: productId
    }
    console.log(editComentarios)
    const addComentario = await Comentarios.create(editComentarios)
 
    res.redirect(`/product/${productId}/details`)
    
  } catch (error) {
    next(error)
  }

})

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