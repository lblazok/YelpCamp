const   Campground  = require('../models/campground'),
        Comment     = require('../models/comment')

let middlewareObj = {};

//CHECK IF USER IS LOGGED IN TO APP
middlewareObj.isLoggedIn = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'You need to be logged in to do that')
    res.redirect('/login')
}


//CHECK IF YOU ARE OWNER OF A COMMENT SO YOU CAN EDIT/DELETE IT
middlewareObj.checkCommentOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Comment.findById(req.params.comment_id, (err, foundComment) => {
            if(err) {
                res.redirect('back')
            } else {
                if(foundComment.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash('error', "You don't have premission to do that")
                    res.redirect('back')
                }
            }
        })
    } else {
        req.flash('error', 'You need to be logged in to do that')
        res.redirect('back')
    }
}


//CHECK IF YOU ARE OWNER OF A CAMPGROUND SO YOU CAN EDIT/DELETE IT
middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    if(req.isAuthenticated()) {
        Campground.findById(req.params.id, (err, foundCampground) => {
            if(err) {
                res.redirect('back')
            } else {
                if(foundCampground.author.id.equals(req.user._id)) {
                    next()
                } else {
                    req.flash('error', "You don't have premission to do that")
                    res.redirect('back')
                }
            }
        })
    } else {
        req.flash('error', 'You need to be logged in to do that')
        res.redirect('back')
    }
}


module.exports = middlewareObj