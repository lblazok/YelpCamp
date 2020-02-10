const   express     = require("express"),
        app         = express(),
        bodyParser  = require("body-parser"),
        mongoose    = require("mongoose")

mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.connect("mongodb://localhost/yelp_camp")


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs")

//SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
})

const Campground = mongoose.model("Campground", campgroundSchema);


// Campground.create({
//     name: "Mountain Goat's Rest", 
//     image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80"
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
            res.render("campgrounds", {campgrounds: campgrounds})
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
    let newCampground = {name: name, image: image}
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


app.listen(3000, () => {
    console.log("Server is listening on port 3000")
})
