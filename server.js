const express = require("express");
const logger = require("morgan");
const app = express();
const passport= require("passport");
const cookieParser= require("cookie-parser");
const session= require("express-session");
const passportConfig = require('./passportConfig')
const cors = require('cors');

const { reviewRouter } = require("./routers/reviewRouter");
const { UserRouter } = require("./routers/userRouter");
const {swapRouter}= require("./routers/swapRouter");
const {bookRouter}= require("./routers/bookRouter");
const {authController} = require("./controllers/AuthController");

const MongoStore = require("connect-mongodb-session")(session)
const mongoose = require('mongoose')
const port = process.env.PORT || 4000;



// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
//     res.header('Access-Control-Allow-Credentials', 'http://localhost:3001');
//     res.header('Access-Control-Allow-Headers', 'Origin, X-requested-With, Content-Type, Accept');
//     res.header('Access-Control-Allow-Methods', 'POST, PUT, GET, DELETE, OPTIONS')
//     res.set('Content-Type', 'application/json');
//     next();
// });

app.use(
    cors({
      origin: "https://exbooks-app.netlify.app", // <-- location of the react app were connecting to
      credentials: true,
    })
  );

var store = new MongoStore({
  uri: `${process.env.DB_FULL}`,
  collection: 'sessions'
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger("combined"));
app.set('trust proxy', 1)
app.use(
  session({
    secret: 'cookiemonster',
    resave: true,
    saveUninitialized: false,
    store: store,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    },
  })
);
app.use(cookieParser("secretcode"));
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

//Routes- move to routes later!!!
app.post("/login", authController.login);
app.post("/register",authController.register);
app.get("/api/current_user", authController.loginGetUser);
app.get("/logout", authController.logout);

app.use("/api/reviews", reviewRouter);
app.use("/api/users", UserRouter);
app.use("/api/swaps",swapRouter);
app.use("/api/books",bookRouter);


app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something is broken!');
});



app.listen(port, () => console.log('Express server is running on port', port));