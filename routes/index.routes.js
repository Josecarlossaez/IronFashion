const express = require('express');
const router = express.Router();

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});
// RUTAS DE AUTENTICACIÓN AUTH

const authRoutes = require("./auth.routes.js")
router.use("/auth", authRoutes)



// RUTAS DE BLOG

const blogRoutes = require("./blog.routes.js")
router.use("/blog", blogRoutes)

// RUTAS DE COLECTION

const colectionRoutes = require("./colection.routes.js")
router.use("/colection", colectionRoutes)

// RUTAS DE PRODUCT

const productRoutes = require("./product.routes.js")
router.use("/product", productRoutes)

// RUTAS DE PROFILE

const profileRoutes = require("./profile.routes")
router.use("/profile", productRoutes)



module.exports = router;