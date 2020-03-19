const   express         = require('express'),
        router          = express.Router({mergeParams: true})

const   Campground  = require('../models/campground'),
        Comment     = require('../models/comment')


//NEW ROUTE
router.get("/new", isLoggedIn,  (req, res) => {
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
router.post("/", isLoggedIn, (req, res) => {
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
                    comment.author.id = req.user._id
                    comment.author.username = req.user.username
                    comment.save()
                    campground.comments.push(comment)
                    campground.save()
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
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