const   express         = require('express'),
        router          = express.Router({mergeParams: true})

const   Campground        = require('../models/campground'),
        Comment           = require('../models/comment'),
        middlewareObj     = require('../middleware')


//NEW ROUTE
router.get("/new", middlewareObj.isLoggedIn,  (req, res) => {
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
router.post("/", middlewareObj.isLoggedIn, (req, res) => {
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
                    req.flash('success', 'Successfuly added comment')
                    res.redirect("/campgrounds/" + campground._id)
                }
            })
        }
    })

})

//COMMENT EDIT ROUTE
router.get('/:comment_id/edit', middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findById(req.params.comment_id, (err, foundComment) => {
        if(err) {
            res.redirect('back')
        } else {
            res.render('comments/edit', {campground_id: req.params.id, comment: foundComment})
        }
    })
})

//COMMENT UPDATE ROUTE
router.put('/:comment_id', middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComment) => {
        if(err) {
            res.redirect('back')
        } else {
            req.flash('success', 'Comment Updated')
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

//COMMENT DESTROY ROUTE
router.delete('/:comment_id', middlewareObj.checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err, deletedComment) => {
        if(err) {
            res.redirect('back')
        } else {
            req.flash('success', 'Comment Deleted')
            res.redirect('back')
        }
    })
})







module.exports = router;