const express = require("express");
const router = express.Router();
const User = require("../models/User.model.js");
const bcrypt = require("bcryptjs");

//RUTAS SIGN UP Y LOGIN

// GET ("/auth/singup")
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

//POST ("/auth/singup")
router.post("/signup", async (req, res, next) => {
  const { username, email, password, role } = req.body;
  if (username === "" || email === "" || password === "") {
    res.render("auth/signup.hbs", {
      errorMessage: "Debes llenar todos los campos",
    });
    return; // detén la ejecución de la ruta.
  }

  // validar la fuerza de la contraseña
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
  if (passwordRegex.test(password) === false) {
    res.render("auth/signup.hbs", {
      errorMessage:
        "La contraseña debe de tener mínimo 8 caracteres, una mayúscula y un número",
    });
    return; // detén la ejecución de la ruta.
  }
  // validar formato de correo electrónico
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
  console.log("cifrado", emailRegex);
  console.log("email:", email);
  if (emailRegex.test(email) === false) {
    res.render("auth/signup.hbs", {
      errorMessage: "Debe escribir el email correctamente",
    });
    return; // detén la ejecución de la ruta.
  }
  try {
    // validar que el usuario sea único, no esté registrado en la db
    const foundUser = await User.findOne({ username: username });
    console.log(foundUser);
    if (foundUser !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "Usuario ya creado con ese nombre",
      });
      return; // detén la ejecución de la ruta.
    } else {
      //  res.redirect("/auth/login")
    }
    // EJEMPLO : verificar tambien que el correo electrónico sea único, no esté registrado en la db
    const foundEmail = await User.findOne({ email: email });
    console.log("email", foundEmail);
    if (foundEmail !== null) {
      res.render("auth/signup.hbs", {
        errorMessage: "Correo electrónico ya creado",
      });
      return;
    } else {
      res.redirect("/auth/login");
    }

    // 2 Elemento de seguridad
    const salt = await bcrypt.genSalt(12);
    // hash                              2 argumentos, password y salt, que acabamos de crear
    const hashPassword = await bcrypt.hash(password, salt);

    // 3.Crear el perfil del usuario
    const newUser = {
      username: username,
      email: email,
      password: hashPassword,
    };
    await User.create(newUser);
  } catch (error) {
    next(error);
  }
});

// GET ("/autht/login")
router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

// POST ("/auth/login")

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);

  // 1. Validaciones de bakcend
  if (email === "" || password === "") {
    res.render("auth/login.hbs", {
      errorMessage: "Los campos deben estar completos",
    });
    return;
  }

  // VERIFICAMOS QUE EL USUARIO EXISTA Y QUE LA CONTRASEÑA SEA CORRECTA
  try {
    // verificar que el usuario exista
    const foundUser = await User.findOne({ email: email });

    if (foundUser === null) {
      // si no existe
      res.render("auth/login.hbs", {
        errorMessage: "Credenciales incorrectas",
      });
      return;
    }
    // 2. Verificar la contraseña del usuario (validarla)

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);
    console.log("is pass valid", isPasswordValid);
    if (isPasswordValid === false) {
      res.render("auth/login.hbs", {
        errorMessage: "Credenciales incorrectas",
      });
      return;
    }
    req.session.activeUser = foundUser; // ESTA ES LA LÍNEA QUE CREA LA SESIÓN / COOKIE

    // método para asegurar que la sesión se ha creado correctamente antes de continuar
    req.session.save(() => {
      // 4. Redireccionar a una página privada

      res.redirect("/profile");
    });
  } catch (error) {
    next(error);
  }
});
// GET "/auth/logout" => cerrar la sesión (destruirla)
router.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});

module.exports = router;
