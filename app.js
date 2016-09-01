var express       = require('express'),
  app             = express(),
  bodyParser      = require('body-parser'),
  flash           = require('connect-flash'),
  passport        = require('passport'),
  LocalStategy    = require('passport-local'),
  methodOverride  = require('method-override'),
  expressSession  = require('express-session'),
  mongoose        = require('mongoose'),
  logger          = require('morgan'),
  Campground      = require('./models/campground'),
  Comment         = require('./models/comment'),
  User            = require('./models/user');

//Requring Routes
var commentRoutes     = require('./routes/comments'),
    campgroundRoutes  = require('./routes/campgrounds'),
    indexRoutes       = require('./routes/index');

mongoose.connect('mongodb://localhost/campsite');
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
app.use(flash());
app.use(logger('dev'));
app.use(expressSession({
  secret: 'I love someone. Yeah That is me only.',
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Setting Flash Messages
app.use(function(req, res, next){
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

//Setting Route Paths for Routes
app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds', commentRoutes);


app.listen(1234, function(){
  console.log('CampSite Has Been Started!');
});
