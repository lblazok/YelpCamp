const   express     = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require("mongoose"),
        Campground  = require("./models/campground"),
        seedDB      = require("./seeds"),
        Comment     = require("./models/comment")



mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true})

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")
app.use(express.static(__dirname + "/public"))

seedDB();

app.get("/", (req, res) => {
    res.render("landing")
})


app.get("/campgrounds", (req, res) => {
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

app.get("/campgrounds/new", (req, res) => {
    res.render("campgrounds/new")
})

app.post("/campgrounds", (req, res) => {
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
app.get("/campgrounds/:id", function(req, res){
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

//====================================================
//COMMENTS ROUTES
//====================================================

//NEW ROUTE
app.get("/campgrounds/:id/comments/new", (req, res) => {
    //find campground by id
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err)
        } else {
            res.render("comments/new", {campground: campground})
        }
    })
    
})

//COMMENTS POST ROUTE
app.post("/campgrounds/:id/comments", (req, res) => {
    //lookup capm using ID
    Campground.findById(req.params.id, function(err, campground) {
        if(err) {
            console.log(err)
            red.redirect("/campgrounds")
        } else {
            Comment.create(req.body.comment, function(err, comment) {
                if(err) {
                    console.log(err)
                } else {
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })
    //create new comment
    //connect new comment to camp
    //redirect camp show page
})


app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})
