const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

const app = express();
const port = process.env.PORT || 5001;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
  })
);

const userController = require("./controllers/user");
const articleController = require("./controllers/article");
const categoryController = require("./controllers/category");

app.use((req, res, next) => {
  res.locals.username = req.session.username;
  res.locals.errorMessage = req.flash("errorMessage");
  next();
});

function redirectIndex(req, res) {
  res.redirect("/index");
}

function redirectBack(req, res) {
  res.redirect("back");
}

function checkPermission(req, res, next) {
  if (!res.locals.username) {
    return redirectIndex;
  }
  return next();
}

// user
app.get("/register", userController.register);
app.post("/register", userController.handleRegister, redirectIndex);
app.get("/login", userController.login);
app.post("/login", userController.handleLogin, redirectBack);
app.get("/logout", userController.handleLogout);

// category
app.get("/categoryList", categoryController.getAll);
app.post(
  "/categoryList",
  checkPermission,
  categoryController.add,
  redirectBack
);
app.get(
  "/updateCategory/:id",
  checkPermission,
  categoryController.update,
  redirectBack
);
app.post(
  "/updateCategory/:id",
  checkPermission,
  categoryController.handleUpdate,
  redirectBack
);
app.get(
  "/deleteCategory/:id",
  checkPermission,
  categoryController.handleDelete,
  redirectBack
);

// article
app.get("/", articleController.index);
app.get("/about", articleController.about);
app.get("/articleList", articleController.getAll);
app.get("/admin", checkPermission, articleController.admin);
app.get("/addArticle", checkPermission, articleController.add);
app.post(
  "/addArticle",
  checkPermission,
  articleController.handleAdd,
  redirectBack
);
app.get("/read/:id", articleController.get);
app.get(
  "/updateArticle/:id",
  checkPermission,
  articleController.update,
  redirectBack
);
app.post(
  "/updateArticle/:id",
  checkPermission,
  articleController.handleUpdate,
  redirectBack
);
app.get(
  "/deleteArticle/:id",
  checkPermission,
  articleController.handleDelete,
  redirectBack
);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
