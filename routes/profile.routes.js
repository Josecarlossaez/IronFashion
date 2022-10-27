const express = require('express');
const router = express.Router();
const User = require("../models/User.model")
const Product = require("../models/Product.model.js")

const {isLoggedIn, isAdmin} = require("../middlewares/auth.middlewares.js")

// GET /"profile"/ el usuario puede ver su perfil
router.get("/", isLoggedIn, (req, res, next) => {


  console.log("Usuario que hace la solicitud: ", req.session.activeUser)
  User.findById(req.session.activeUser._id)
  .then((response) => {
    res.render("profile/user-profile.hbs", {
      userDetails: response
    })
  })
  .catch((err) => {
    next(err)
  })
})

router.get("/admin-profile", isAdmin, (req, res, next) => {
  res.render("profile/admin-profile.hbs")
})




module.exports = router;