const express = require('express');
const router = express.Router();
const Collection = require("../models/Collection.model.js")
const Product = require("../models/Product.model.js")
const uploader = require("../middlewares/cloudinary.js")
const User = require("../models/User.model.js")
const {isLoggedIn, isAdmin} = require("../middlewares/auth.middlewares.js")


// GET ("/colection/create")
router.get("/create",isAdmin, (req, res, next) => {
    Product.find()
    .then((productos) => {
        res.render("colection/create.hbs",{
            productList:productos
        })
    }).catch((err) =>{
        next(err)
    })
})

//POST ("/colection/create")
router.post("/create",uploader.single("img") ,(req,res,next) =>{
    const{title, description, productos} = req.body
    const colectiontoAdd ={title,description,img: req.file.path , productos}
    Collection.create(colectiontoAdd)
    .then(() => {
        res.redirect("/colection/list")
    }).catch((err) => {
        next(err)
    })

})

// VISUALIZAR LISTA DE COLECCIONES
// GET ("/colection/list")
router.get("/list", async (req, res, next) => {
    
try {
    const colectionList = await Collection.find().populate("productos")  

    res.render("colection/list.hbs",{
        colectionList
       
      })     
} catch (error) {
    next(error)
}

})

//GET ("/colection/:colectionId/edit-form")
router.get("/:colectionId/edit-form", isAdmin, async (req, res, next) => {
    const{colectionId} = req.params

    try {
        const colectionDetails = await Collection.findById(colectionId).populate("productos")
        const allProducts = await Product.find()
        console.log("detalles de la coleccion", colectionDetails)
        console.log("detalles de los productos", allProducts)
        res.render("colection/edit-form.hbs", {
            colectionDetails,
            allProducts
        })
        
    } catch (error) {
        next (error)
    }
    

});

//POST ("/colection/:colectionId/edit-form")
router.post("/:colectionId/edit-form",isAdmin, (req, res, next) => {
    const{colectionId} = req.params
    const{title, description, productos} =req.body
    const colectionUpdate={title, description, productos}
    Collection.findByIdAndUpdate(colectionId , colectionUpdate)
    .then(() => {
res.redirect("/colection/list")
    })
    .catch((err) => {
        next(err)
    })
});
//POST ("/colection/:colectionId/delete")
router.post("/:colectionId/delete",isAdmin,(req, res, next) => {
    Collection.findByIdAndDelete(req.params.colectionId)
    .then(() => {
       res.redirect("/colection/list")
    })
    .catch((err) => {
        next(err)
    })
})

// GET ("/colection/:colectionId/details")
router.get("/:colectionId/details",isLoggedIn, async (req, res, next) => {
    const {colectionId} = req.params;


    try {
        const colectionDetails = await Collection.findById(colectionId).populate("productos")
        // const allProducts = await Product.find()
        //console.log(allProducts)
        res.render("colection/details.hbs", {
        colectionDetails
    //    allProducts 
    })
        
    } catch (error) {
        next(error)
    }  
   
  });


module.exports = router;