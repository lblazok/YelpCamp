const   express     = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require("mongoose")


mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true})


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")

//SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
})

const Campground = mongoose.model("Campground", campgroundSchema);


// Campground.create({
//     name: "Granite Hill", 
//     image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80",
//     description: "This is a huge granite hill, no bathrooms. No water. Beautiful granite!"
// }, function(err, campground) {
//     if(err) {
//         console.log(err)
//     } else {
//         console.log("New campground")
//         console.log(campground)
//     }
// })



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
    Campground.findById(req.params.id, function(err, foundCampground){
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
