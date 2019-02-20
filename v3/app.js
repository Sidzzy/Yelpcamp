var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp_v3", { useNewUrlParser: true });

//New for V3:
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");
seedDB();

app.use (bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

//INDEX
app.get("/", function(req,res){
    res.render("landing");
});
//SHOW
app.get("/campgrounds", function(req,res){
    // Get all the campgrounds from db
    Campground.find({},function(err, allcampgrounds){
        if(err){
            console.log(err);
        } else{
            //redirect back to /campground
            res.render("index",{campgrounds:allcampgrounds});            
        }
    })

});
//CREATE
app.post("/campgrounds",function(req,res){
   //get data from the form add to camgrounds array 
    // res.send("You heat the post campgrond");
 
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampgrounds = {name : name,image : image, description: desc};
    //Add the new added campground into the DB:
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
app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
});
//SHOW- show more info about a component.
app.get("/campgrounds/:id", function(req, res){
    //find the campground with the provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log("hello");
            console.log(err);
        } else{
            //Display more info about that campground
            console.log(foundCampground);
            res.render("show", {campground: foundCampground});     
        }
    });
    //findById will search in the db if there exist a data with the given id.
});

app.get("*", function(req,res){
    res.send("This URL Doesn't Exists");
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
}); 