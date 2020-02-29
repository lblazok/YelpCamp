const   express                     = require("express"),
        app                         = express(),
        bodyParser                  = require("body-parser"),
        mongoose                    = require("mongoose"),
        Campground                  = require("./models/campground"),
        seedDB                      = require("./seeds"),
        Comment                     = require("./models/comment"),
        passport                    = require('passport'),
        LocalStrategy               = require('passport-local'),
        User                        = require('./models/user')

//requing routes
const   commentRoutes               = require('./routes/comments'),
        campgroundRoutes            = require('./routes/campgrounds'),
        indexRoutes                  = require('./routes/index')


mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true})

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))

seedDB();

//PASSPORT CONFIG
app.use(require('express-session')({
    secret: 'Once again Rusty wins cutest dog!',
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

//Every route will use currentUser and our header file will use it to hide/show links
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
})


app.use(indexRoutes);
app.use('/campgrounds/:id/comments',commentRoutes);
app.use('/campgrounds',campgroundRoutes);
 
app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})
