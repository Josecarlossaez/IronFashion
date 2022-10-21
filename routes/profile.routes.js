const express = require('express');
const router = express.Router();
const User = require("../models/User.model")

const {isLoggedIn, isAdmin} = require("../middlewares/auth.middlewares.js")

router.get("/admin-profile", isLoggedIn, isAdmin, (req, res, next) => {
  res.render("profile/admin-profile.hbs")
})
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



module.exports = router;