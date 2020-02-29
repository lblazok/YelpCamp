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

router.get("/new", (req, res) => {
    res.render("campgrounds/new")
})

router.post("", (req, res) => {
    // get data form form and add data to campgrounds array
    let name = req.body.name
    let image = req.body.image
    let desc = req.body.description
    let newCampground = {name: name, image: image, description: desc}
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

module.exports = router;