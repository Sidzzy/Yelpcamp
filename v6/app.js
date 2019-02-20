var express = require("express"),
    app = express(),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/yelp_camp_v6", { useNewUrlParser: true });


/*===================
Passport configuration
===================*/
app.use(require("express-session")({
    secret: "Snowy is the cuttest!!",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*Done in   -----Yelpcamp Auth last video----- 
The app.use is actually used whenever any route is called.
Here this is a middleware which will work for all routes
req.user has the data of a logged in user 
if the user won't be there then req.user will be null
currentUser will be the variable passed to all the ejs pages that is rendered in the routes.*/
app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

var Campground = require("./models/campground");
var Comment = require("./models/comment");

//To create temporary campgrounds:
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

app.get("/campgrounds/:id/comments/new", isLoggedIn, function(req, res) {
    //find campground by id:
    Campground.findById(req.params.id, function(err, campground){    
        if(err)
            console.log(err);
        else{
            res.render("comments/new", {campground: campground});
        }
    });
});
app.post("/campgrounds/:id/comments/new", isLoggedIn,function(req, res) {
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

/*===================
Auth Routes
===================*/
//Register:
app.get("/register", function(req, res){
   res.render("register");
});
app.post("/register", function(req, res){
    User.register(new User({username: req.body.username}), req.body.password,function(err,user){
        if(err){ 
            console.log(err);
            return res.render('register');
        } 
        passport.authenticate("local")(req, res, function(){
           res.redirect("/campgrounds");
        });
    });
});
//Login:
app.get("/login", function(req, res){
   res.render("login");
});
app.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}), function(req, res){
});

//Logout
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.get("*", function(req,res){
    res.send("This URL Doesn't Exists");
});

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
}); 