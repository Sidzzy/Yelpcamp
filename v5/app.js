var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp_v3", { useNewUrlParser: true });

//New for V3:
var Campground = require("./models/campground");
var Comment = require("./models/comment");
// var seedDB = require("./seeds");
// seedDB();

app.use (bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
//here the __dirname tells the path to the directory in which this file is at it is more safer to write but not mendatory.

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
            res.render("campgrounds/index",{campgrounds:allcampgrounds});            
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
    res.render("campgrounds/new.ejs");
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
            res.render("campgrounds/show", {campground: foundCampground});     
        }
    });
    //findById will search in the db if there exist a data with the given id.
});

app.get("/campgrounds/:id/comments/new",function(req, res) {
    //find campground by id:
    Campground.findById(req.params.id, function(err, campground){    
        if(err)
            console.log(err);
        else{
            res.render("comments/new", {campground: campground});
        }
    });
});
app.post("/campgrounds/:id/comments/new",function(req, res) {
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
app.get("*", function(req,res){
    res.send("This URL Doesn't Exists");
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
}); 