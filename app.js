const   express     = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require("mongoose")
        Campground  = require("./models/campground")
        seedDB      = require("./seeds")



mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true})

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")

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
            res.render("index", {campgrounds: campgrounds})
        }
    })
   
    // res.render("campgrounds", {campgrounds: campgrounds})
})

app.get("/campgrounds/new", (req, res) => {
    res.render("new")
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
            res.render("show", {campground: foundCampground});
        }
    });
})  


app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})
