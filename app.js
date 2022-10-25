// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// default value for title local
const capitalize = require("./utils/capitalize");
const projectName = "iron-fashion";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

app.use((req, res, next) => {
  if(req.session.activeUser === undefined) {
    console.log("quiero saber que hay dentro del req.session.activeUser:", req.session.activeUser)
    res.locals.isUserActive = false
  } else{
    res.locals.isUserActive = true
  }
  next()
})
// app.use((req, res, next) => { 
//   if(req.session.activeUser.role === "admin"){
//     res.locals.isAdminActive = true
//   }else {
//     res.locals.isAdminActive = false
//   }
// })
// app.use((req, res, next) => { 
//   if(req.session.activeUser === undefined || req.session.activeUser.role ==="user"){
//     res.locals.isAdminActive = false
//   }else {
//     console.log("user is admin")
//     res.locals.isAdminActive = true
//   }
//   next()
// })
app.use((req, res, next) => { 
  if(req.session.activeUser !== undefined && req.session.activeUser.role ==="admin"){
    res.locals.isAdminActive = true
  }else {
    
    res.locals.isAdminActive = false
  }
  next()
})

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
