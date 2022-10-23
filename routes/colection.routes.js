const express = require('express');
const router = express.Router();
const Collection = require("../models/Collection.model.js")
const Product = require("../models/Product.model.js")
// GET ("/colection/create")
router.get("/create", (req, res, next) => {
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
router.post("/create", (req,res,next) =>{
    const{title, description, productos} = req.body
    const colectiontoAdd ={title,description,productos}
    Collection.create(colectiontoAdd)
    .then((colection) => {
        res.redirect("/colection/list")
    }).catch((err) => {
        next(err)
    })

})

// VISUALIZAR LISTA DE COLECCIONES
// GET ("/colection/list")
router.get("/list", (req, res, next) => {
   Collection.find()
   .populate("productos")
   .then((colection) => {
    res.render("colection/list.hbs",{
        colectionList : colection
    })

   }).catch((err) => {
    next(err)
   })
})

//GET ("/colection/:colectionId/edit-form")
router.get("/:colectionId/edit-form", (req, res, next) => {
    const{colectionId} = req.params
   
    Collection.findById(colectionId)
    Product.find()
    .then((colection) => {
   res.render("colection/edit-form.hbs", {
    colectionDetails : colection
   })
    })
    .catch((err) => {
        next(err)
    })
});

//POST ("/colection/:colectionId/edit-form")
router.post("/:colectionId/edit-form", (req, res, next) => {
    const{colectionId} = req.params
    const{title, description, productos} =req.body
    const colectionUpdate={title, description, productos}
    Collection.findByIdAndUpdate(colectionId , colectionUpdate)
    .then((colection) => {
res.redirect("/colection/list")
    })
    .catch((err) => {
        next(err)
    })
});
//POST ("/colection/:colectionId/delete")
router.post("/:colectionId/delete", (req, res, next) => {
    Collection.findByIdAndDelete(req.params.colectionId)
    .then(() => {
       res.redirect("/colection/list")
    })
    .catch((err) => {
        next(err)
    })
})


module.exports = router;