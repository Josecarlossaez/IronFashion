const express = require('express');
const router = express.Router();
const Blog = require("../models/Blog.model.js")

// GET ("/blolg/list") visualizar Blogs
router.get("/list", (req, res, next) => {
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
router.get("/create", (req,res,next) => {
    res.render("blog/create.hbs")
})

// POST ("/blog/create")
router.post("/create", (req, res, nex) => {
    const {title, description,img} = req.body
    const blogToAdd ={title, description,img}
    Blog.create(blogToAdd)
    .then((blog) => {
res.redirect("/blog/list")
    })
    .catch((err) => {
        next(err)
    })
})

// GET ("/blog/:blogId/edit-form")
router.get("/:blogId/edit-form", (req,res,next) => {
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
router.post("/:blogId/edit-form", (req,res,next) =>{
    const {blogId} = req.params
    const {title, description,img} = req.body
    const blogUpdate={title,description,img}
    Blog.findByIdAndUpdate(blogId,blogUpdate)
    .then((update) => {
res.redirect("/blog/list")
    })
    .catch((err) => {
        next(err)
    })
});

//POST ("/blog/:blogId/delete")
router.post("/:blogId/delete", (req, res, next) => {
    Blog.findByIdAndDelete(req.params.blogId)
    .then(() => {
        res.redirect("/blog/list")
    })
    .cathc ((err) => {
        next(err)
    })
})

module.exports = router;