

require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mongoURI = process.env.mongoLink;
const path = require("path");
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/ExpressError.js")
const { required } = require('joi');
const listingRouter = require('./rauters/listing.js')
const reviewRouter = require('./rauters/reviews.js')
const userRouter = require('./rauters/user.js')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash')
const LocalStrategy = require("passport-local")
const pwsmoongus = require("passport-local-mongoose")
const User = require('./models/user.js')
const passport = require('passport');
const secreT = process.env.SECRET;

 
// Database connection


// mongoose.connect(mongoURI)
//   .then(() => console.log('MongoDB connected...'))
//   .catch(err => console.error('Error connecting to MongoDB:', err));




// Set view engine
app.set("view engine", 'ejs');
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
    mongoUrl: mongoURI,
    crypto:{
        secret:secreT,
    },
    touchAfter: 24*60*60,
})


const sessionOptions = {
    secret: 'code',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: false,
    },
};

app.use(session(sessionOptions));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.curUser = req.user;
    

    next();
});

// Routes
app.use('/listings', listingRouter);
app.use('/', userRouter);
app.use('/listings/:id/reviews', reviewRouter);

// Error handling middleware
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found"));
});

app.use((err, req, res, next) => {
    const { statusCode = 500, message = "Something went wrong" } = err;
   
    res.status(statusCode).render("listing/error", { error: { statusCode, message } });
});

// Listen
const port = 6060;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
