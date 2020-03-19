const   express         = require('express'),
        router          = express.Router()

const   Campground  = require('../models/campground')

router.get("/", (req, res) => {
    //Get all campgrounds from db
    Campground.find({}, function(err, campgrounds) {
        if(err){
            console.log(err)
        } else {
            res.render("campgrounds/index", {campgrounds: campgrounds})
        }
    })
   
    // res.render("campgrounds", {campgrounds: campgrounds})
})

router.get("/new", isLoggedIn, (req, res) => {
    res.render("campgrounds/new")
})

router.post("", isLoggedIn, (req, res) => {
    // get data form form and add data to campgrounds array
    let name = req.body.name
    let image = req.body.image
    let desc = req.body.description
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, image: image, description: desc, author: author}
    //Create a new campground and save it to DB
    Campground.create(newCampground, function(err, newItem) {
        if(err) {
            console.log(err)
        } else {
            // redirect back to campgrounds array
            res.redirect("/campgrounds")
        }
    })
    
   
})

//SHOW - show more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})  

// EDIT ROUTE
router.get('/:id/edit', (req, res) => {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            res.redirect('/campgrounds')
        } else {
            res.render('campgrounds/edit', {campgrounds: foundCampground})
        }
    })
})

//PUT ROUTE
router.put('/:id', (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {
            res.redirect('/campgrounds')
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

//DELETE ROUTE
router.delete('/:id', (req, res) =>{
    Campground.findByIdAndDelete(req.params.id, (err) => {
        if(err) {
            res.redirect('/campgrounds')
        } else {
            res.redirect('/campgrounds')
        }
    })
})

//midlewere
function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login')
}

module.exports = router;