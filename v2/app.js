var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true });

var campgrounds =[
            {name:"Salman Khan", image:"https://pixabay.com/get/ef3cb00b2af01c22d2524518b7444795ea76e5d004b0144597f3c87eaee4b1_340.jpg" },
            {name:"Sharukh Khan", image:"https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104491f2c270a0e4bcbc_340.jpg" },
            {name:"Amir Khan", image:"https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104491f2c270a0e4bcbc_340.jpg" }
    ];
app.use (bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

//SCHEMA SETUP
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});

var Campground = mongoose.model("Campground",campgroundSchema);

//This way we can also create by our own:
// Campground.create(
//     {
//         name: "Granite Hill",
//         image: "https://cdn.pixabay.com/photo/2017/09/14/16/25/coruh-valley-2749538__340.jpg",
//         description: "This is a huge granite hill, no bathroomsm, no water, with no oxygen, but it's beautiful."
//     },
//     function(err, campground){
//         if(err){
//             console.log(err);
//         }
//         else{
//             console.log("Newly created campground");
//             console.log(campground);
//         }
//     }
//     );

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
    Campground.findById(req.params.id,function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            //Display more info about that campground
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