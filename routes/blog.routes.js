const express = require('express');
const router = express.Router();
const Blog = require("../models/Blog.model.js")
const uploader = require("../middlewares/cloudinary.js");
const {isLoggedIn, isAdmin} = require("../middlewares/auth.middlewares.js")

// GET ("/blolg/list") visualizar Blogs
router.get("/list", isLoggedIn,(req, res, next) => {
    Blog.find()
    .then((blog) => {
res.render("blog/list.hbs",{
    blogList : blog
})
    })
    .catch((err)=> {
        next(err)
    })
})

// GET ("/blog/create")
router.get("/create",  isAdmin, (req,res,next) => {
    res.render("blog/create.hbs")
})

// POST ("/blog/create")

router.post("/create",uploader.single("img"),  isAdmin, async(req, res, next) => {
    const{title, description} = req.body

   try{
    
     const blogToAdd ={title, description,img: req.file.path}
     await Blog.create(blogToAdd);
     res.redirect("/blog/list")
 
   }catch (err){
     next(err)
   }
 })

// GET ("/blog/:blogId/edit-form")
router.get("/:blogId/edit-form",isAdmin, (req,res,next) => {
    const {blogId} = req.params
    Blog.findById(blogId)
    .then((edition) => {
res.render("blog/edit-form.hbs", {
    blogDetails : edition
})
    })
    .catch((err) => {
        next(err)
    })
})

//POST ("/blog/:blogId/edit-form")
router.post("/:blogId/edit-form", uploader.single("img"), isAdmin, (req,res,next) =>{
    const {blogId} = req.params
    const {title, description} = req.body
    const blogUpdate={title,description,img: req.file.path}
    Blog.findByIdAndUpdate(blogId,blogUpdate)
    .then(() => {
res.redirect("/blog/list")
    })
    .catch((err) => {
        next(err)
    })
});

//POST ("/blog/:blogId/delete")
router.post("/:blogId/delete", isAdmin,(req, res, next) => {
    Blog.findByIdAndDelete(req.params.blogId)
    .then(() => {
        res.redirect("/blog/list")
    })
    .cathc ((err) => {
        next(err)
    })
})

module.exports = router;