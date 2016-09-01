var express   = require('express'),
  router      = express.Router(),
  Campground  = require('../models/campground'),
  middleware  = require('../middleware');

router.get('/', function(req, res){
  Campground.find({}, function(err, allCampgrounds){
    if(err){
      console.log(err);
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.render('campgrounds/index', {campgrounds: allCampgrounds});
    }
  });
});

router.post('/', middleware.isLoggedIn, function(req, res){
  var name = req.body.name;
  var image = req.body.image;
  var description = req.body.description;
  var author = {
    id: req.user._id,
    username: req.user.username
  };
  var price = req.body.price;
  var newCampground = {name: name, image: image, description: description, author: author, price: price}
  Campground.create(newCampground, function(err, newlyCreated){
    if(err){
      console.log(err);
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      console.log(newlyCreated._id+" has been created newly");
      res.redirect('/campgrounds');
    }
  });
});

router.get('/new', middleware.isLoggedIn, function(req, res){
  res.render('campgrounds/new');
});

router.get('/:id', function(req, res){
  Campground.findById(req.params.id)
  .populate('comments')
  .exec(function(err, foundCampground){
    if(err){
      console.log(err);
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else if(foundCampground){
      res.render('campgrounds/show', {campground: foundCampground});
    } else {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    }
  });
});

router.get('/:id/edit', middleware.checkCampgroundOwnerShip, function(req, res){
  Campground.findById(req.params.id, function(err, foundCampground){
    if(foundCampground){
      res.render('campgrounds/edit', {campground: foundCampground});
    } else {
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    }
  });
});

router.put('/:id', middleware.checkCampgroundOwnerShip, function(req, res){
  var id = req.params.id;
  var campground = req.body.campground;
  console.log(campground);
  Campground.findByIdAndUpdate(id, campground, function(err, updatedCampground){
    if(err){
      console.log(err);
      req.flash('error', 'Something went wrong');
      res.redirect('back');
    } else {
      res.redirect('/campgrounds/' + req.params.id);
    }
  });
});

router.delete('/:id', middleware.checkCampgroundOwnerShip, function(req, res){
  Campground.findByIdAndRemove(req.params.id, function(err, removedCampground){
    if(err){
      console.log(err);
      req.flash('error', 'Something went wrong');
      res.redirect('/campgrounds');
    } else {
      res.redirect('/campgrounds');
    }
  });
});

module.exports = router;
