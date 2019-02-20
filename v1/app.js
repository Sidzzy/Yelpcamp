var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var campgrounds =[
            {name:"Salman Khan", image:"https://pixabay.com/get/ef3cb00b2af01c22d2524518b7444795ea76e5d004b0144597f3c87eaee4b1_340.jpg" },
            {name:"Sharukh Khan", image:"https://pixabay.com/get/e837b1072af4003ed1584d05fb1d4e97e07ee3d21cac104491f2c270a0e4bcbc_340.jpg" },
            {name:"Amir Khan", image:"https://pixabay.com/get/e83db50929f0033ed1584d05fb1d4e97e07ee3d21cac104491f2c270a0e4bcbc_340.jpg" }
    ];
app.use (bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");

app.get("/", function(req,res){
    res.render("landing");
});
app.get("/campgrounds", function(req,res){
    res.render("campgrounds",{campgrounds:campgrounds});
});
app.post("/campgrounds",function(req,res){
   //get data from the form add to camgrounds array 
    // res.send("You heat the post campgrond");
 
    var name = req.body.name;
    var image = req.body.image;
    var newCampgrounds = {name : name,image : image};
    campgrounds.push(newCampgrounds);
    //redirect back to camgrounds.
    res.redirect("/campgrounds");
});
app.get("/campgrounds/new",function(req,res){
    res.render("new.ejs");
});
app.get("*", function(req,res){
    res.send("This URL Doesn't Exists");
});
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
}); 