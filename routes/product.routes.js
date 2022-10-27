const express = require("express");
const router = express.Router();
const Product = require("../models/Product.model.js");
const uploader = require("../middlewares/cloudinary.js");
const { isAdmin, isLoggedIn } = require("../middlewares/auth.middlewares.js");
const Comentarios = require("../models/Comentarios.model.js");
const User = require("../models/User.model.js");

//GET  ("/product/create") ruta para visualizar la página para crear un producto
router.get("/create", isAdmin, (req, res, next) => {
  res.render("product/create.hbs");
});

// POST ("/product/create") ruta para crear un producto
router.post("/create", uploader.single("img"), isAdmin, async (req, res, next) => {
    const { productType, cost, description, temporada, size, color } = req.body;

    try {
      const productToAdd = {
        productType,
        cost,
        description,
        temporada,
        size,
        img: req.file.path,
        color,
      };
      await Product.create(productToAdd);
      res.redirect("/product/list");
    } catch (err) {
      next(err);
    }
  }
);

//GET ("/produtct/list")ruta donde el admin puede ver todos los productos
router.get("/list", isLoggedIn, (req, res, next) => {
  Product.find()
    .then((listProduct) => {
      res.render("product/list.hbs", {
        listProduct,
      });
    })
    .catch((err) => {
      next(err);
    });
});

// GET ("/product/:productId/details")
router.get("/:productId/details", isLoggedIn, async (req, res, next) => {
  const { productId } = req.params;
 
  try {
    const productDetails = await Product.findById(productId); 
    console.log("Detalles del producto:", productDetails);

    
    const commentDetails = await Comentarios.find({product: productId,}).populate("owner", "username"); //Primer argumento:Para sacar la informacion del owner y el Segundo argumento es para sacar solo el username del owner y evitar pasar todos los parámetros que contiene owner
    console.log("Detalles de commentDetails:", commentDetails);

    res.render("product/details.hbs", {
      productDetails,
      commentDetails,
    });
  } catch (error) {
    next(error);
  }
});

//POST ("/product/:productId/details")
router.post("/:productId/details/add-comment", isLoggedIn, async (req, res, next) => {
    const { productId } = req.params;
    const userId = req.session.activeUser._id;
    const { title, description, owner, product } = req.body;
    console.log(req.body.title);
    console.log(req.body.description);
    console.log(productId);
    console.log(userId);

    try {
      const editComentarios = {
        title,
        description,
        owner: userId,
        product: productId,
      };
      console.log(editComentarios);
     await Comentarios.create(editComentarios);

      res.redirect(`/product/${productId}/details`);
    } catch (error) {
      next(error);
    }
  }
);

//GET ("/product/:productId/edit-form")
router.get("/:productId/edit-form", isAdmin, (req, res, next) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then((product) => {
      res.render("product/edit-form.hbs", {
        productDetails: product,
      });
    })
    .catch((err) => {
      next(err);
    });
});

//POST ("/product/:productId/edit-form")
router.post("/:productId/edit-form", uploader.single("img"), isAdmin, (req, res, next) => {
    const { productId } = req.params;
    const { productType, cost, description, temporada, size, color } = req.body;
    const editProduct = {
      productType,
      cost,
      description,
      temporada,
      size,
      img: req.file.path,
      color,
    };
    Product.findByIdAndUpdate(productId, editProduct)
      .then(() => {
        res.redirect("/product/list");
      })
      .catch((err) => {
        next(err);
      });
  }
);

//POST ("/product/:productId/delete")
router.post("/:productId/delete", isAdmin, (req, res, next) => {
  Product.findByIdAndDelete(req.params.productId)
    .then(() => {
      res.redirect("/product/list");
    })
    .catch((err) => {
      next(err);
    });
});

//GET ("/product/search-product")
router.get("/search-product", async (req, res, next) => {
  const { productType, color, size } = req.query;
  if (productType === "" && color === "" && size === "") {
    res.render("product/search-product.hbs");
    return;
  }
  const searchQuery = {};
  if (productType !== "") {
    searchQuery.productType = productType;
  }
  if (color !== "") {
    searchQuery.color = color;
  }
  if (size !== ""){
    searchQuery.size = size;
  }
  console.log(searchQuery);
  try {
    const details = await Product.find(searchQuery);
    res.render("product/search-product.hbs", {
      details,
    });
  } catch (error) {
    next(error);
  }
});

// GET ("/product/favoritos")
router.get("/favoritos", async (req, res, next) => {
  const userId = req.session.activeUser._id


  try {
    const productoFavoritos = await User.findById(userId).populate("favoritos", "productType img")
    console.log(productoFavoritos)
    res.render("product/favoritos.hbs", {
      productoFavoritos
    })
  } catch (error) {
    
  }
})


// POST ("/product/favoritos")
router.post("/:productId/add-favoritos",  async (req, res, next) => {
  const {productId} = req.params
  const userId = req.session.activeUser._id

  try {    

    await User.findByIdAndUpdate(userId, {$addToSet:{favoritos: productId}})  
    res.redirect("/product/list")
   
  } catch (error) {
    next(error)
  }  

})

//POST ("/:productId/delete-favoritos")
router.post("/:productId/delete-favoritos", async (req, res, next) => {
  const {productId} = req.params
  const userId = req.session.activeUser._id

  try {    

    await User.findByIdAndUpdate(userId, {$pull:{favoritos: productId}})  
    res.redirect("/product/favoritos")
   
  } catch (error) {
    next(error)
  }  
})





module.exports = router;
