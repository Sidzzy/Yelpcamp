var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
//here we are not writing "../middleware/index" because index is bydefault
var middleware = require("../middleware");
//SHOW
router.get("/", function(req,res){
    // Get all the campgrounds from db
    Campground.find({},function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else{
            //redirect back to /campground
            res.render("campgrounds/index",{campgrounds:allcampgrounds});            
        }
    });

});
//CREATE
router.post("/",middleware.isLoggedIn ,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var newCampgrounds = {name : name,image : image, description: desc, author: author};
    Campground.create(newCampgrounds,function(err, newlyCreated){
        if(err){
            console.log(err);
        }
        else{
            //redirect back to camgrounds.
            res.redirect("/campgrounds");
        }
    });
});  
//NEW - show form to create a campground.
router.get("/new",middleware.isLoggedIn, function(req,res){
    res.render("campgrounds/new");
});

//SHOW- show more info about a component.
router.get("/:id", function(req, res){
    //find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("hello");
            console.log(err);
        } else{
            //Display more info about that campground
            console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});     
        }
    });
    //findById will search in the db if there exist a data with the given id.
});

//Edit Campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//Update campgrounds route
router.put("/:id", middleware.checkCampgroundOwnership,function(req, res){
    console.log("hello");
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
       if(err){      
            res.redirect("/campgrounds");
       }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY Campground Route
router.delete("/:id", middleware.checkCampgroundOwnership,function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err)      
            res.redirect("/campgrounds");
        else{
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;