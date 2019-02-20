var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

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
router.post("/",function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampgrounds = {name : name,image : image, description: desc};
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
router.get("/new",function(req,res){
    res.render("campgrounds/new.ejs");
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


module.exports = router;