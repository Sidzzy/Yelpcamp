var express = require("express");
var router = express.Router({mergeParams: true});
//mergeParams: ture->will merge the params from the campgrounds and the comments together. This became a problem when we have shorten our routes url.
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//Comments New
router.get("/new", isLoggedIn, function(req, res) {
    //find campground by id:
    console.log(req.params.id);
    Campground.findById(req.params.id, function(err, campground){    
        if(err)
            console.log(err);
        else{
            res.render("comments/new", {campground: campground});
        }
    });
});
//Comments Create
router.post("/new", isLoggedIn,function(req, res) {
    //lookup campground using id:
    Campground.findById(req.params.id, function(err, campground){    
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }
        else{
            Comment.create(req.body.comment, function(err,comment){
               if(err)
                    console.log(err);
                else{
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect('/campgrounds/' + campground._id);
                }
                
            });
            // console.log();
        }
    });
    //create new comment
    //connect new comment to campground
    //redirect campground show page
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;