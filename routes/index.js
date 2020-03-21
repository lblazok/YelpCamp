const   express         = require('express'),
        router          = express.Router();

const   User                = require('../models/user'),
        passport            = require('passport'),
        middlewareObj       = require('../middleware')
                


//ROOT ROUTE
router.get("/", (req, res) => {
    res.render("landing")
})

//====================================================
//AUTH ROUTES
//====================================================

//SHOW REGISTER FORM
router.get('/register', (req, res) => {
    res.render('register')
})

//SIGN UP LOGIC
router.post('/register', (req, res) => {
    let newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            return res.render("register", {"error": err.message});
        }
        passport.authenticate('local')(req, res, function(){
            req.flash('success', 'Welcome to YelpCamp ' + user.username)
            res.redirect('/campgrounds')
        })
    } )
})

//SHOW LOGIN FORM
router.get('/login', (req, res) => {
    res.render('login');
})

//LOGIN LOGIC
router.post('/login', passport.authenticate('local', {
    successRedirect: '/campgrounds',
    failureRedirect: '/login'
}), (req, res) => {
   
})

//LOGOUT ROUTE
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out!')
    res.redirect('/campgrounds')
})



module.exports = router;