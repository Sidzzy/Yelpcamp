var express = require("express"),
    app = express(),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    bodyParser = require("body-parser"),
    User = require("./models/user"),
    mongoose = require("mongoose"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment");
    
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");

mongoose.connect("mongodb://localhost/yelp_camp_v6", { useNewUrlParser: true });

app.use (bodyParser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));

//To create temporary campgrounds:
// var seedDB = require("./seeds");
// seedDB();


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

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   next();
});

//new for v7:
 
app.use("/campgrounds", campgroundRoutes);//writing "/campgrounds" will help to append the routes in the campground.js file with "/campgrounds"
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/", indexRoutes);
//Here the use order is important :Very Important

//NOT WORKING LIKE THIS??:
/*app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);*/

app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server has started");
}); 