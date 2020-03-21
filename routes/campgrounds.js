const   express         = require('express'),
        router          = express.Router()

const   Campground      = require('../models/campground'),
        middlewareObj      = require('../middleware')

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

router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
    res.render("campgrounds/new")
})

router.post("", middlewareObj.isLoggedIn, (req, res) => {
    // get data form form and add data to campgrounds array
    let name = req.body.name
    let price = req.body.price
    let image = req.body.image
    let desc = req.body.description
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = {name: name, price: price, image: image, description: desc, author: author}
    //Create a new campground and save it to DB
    Campground.create(newCampground, function(err, newItem) {
        if(err) {
            console.log(err)
        } else {
            // redirect back to campgrounds array
            req.flash('success', 'Campground Created')
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
router.get('/:id/edit', middlewareObj.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, function(err, foundCampground) {
        if(err) {
            res.redirect('/campgrounds')
        } else {
            res.render('campgrounds/edit', {campgrounds: foundCampground})
        }
    })
})

//PUT ROUTE
router.put('/:id', middlewareObj.checkCampgroundOwnership,  (req, res) => {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground) => {
        if(err) {
            res.redirect('/campgrounds')
        } else {
            req.flash('success', 'Campground Updated')
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

//DELETE ROUTE
router.delete("/:id", middlewareObj.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err, campgroundRemoved) => {
        if (err) {
            console.log(err);
        }
        Comment.deleteMany( {_id: { $in: campgroundRemoved.comments } }, (err) => {
            if (err) {
                console.log(err);
            }
            req.flash('success', 'Campground Deleted')
            res.redirect("/campgrounds");
        });
    })
});





module.exports = router;