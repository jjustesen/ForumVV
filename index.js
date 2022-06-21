const express = require("express");
const exphbs = require("express-handlebars");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const flash = require("express-flash");

const app = express();

const conn = require("./db/conn");

// Json
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Import Routes
const toughtsRoutes = require("./routes/ToughtsRoutes");
const apiController = require("./routes/ApiRoutes");
const authRoutes = require("./routes/AuthRoutes");

// Import Controller
const ToughtsController = require("./controllers/ToughtsController");

// Models
const Tougth = require("./models/Tought");
const User = require("./models/User");

// Session middleware

app.use(
  session({
    name: "session",
    secret: "my_secret",
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require("path").join(require("os").tmpdir(), "sessions"),
    }),
    cookie: {
      secure: false,
      maxAge: 3600000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: false,
    },
  })
);

app.use(flash());

// View Engine
app.engine(
  "handlebars",
  exphbs.engine({ extname: "handlebars", defaultLayout: "main" })
);
app.set("view engine", "handlebars");

// Public path
app.use(express.static("public"));

// Setting session to response
app.use((req, res, next) => {
  if (req.session.userid) {
    res.locals.session = req.session;
  }

  next();
});

// Routes

app.use("/toughts", toughtsRoutes);
app.use("/api", apiController);
app.use("/", authRoutes);

app.get("/", ToughtsController.showToughts);

conn
  .sync()
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => console.log(err));
