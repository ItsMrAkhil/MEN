var Campground  = require('../models/campground'),
    Comment     = require('../models/comment');

var middlewareObj = {};

middlewareObj.checkCampgroundOwnerShip = function(req, res, next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id, function(err, foundCampground){
      if(err){
        req.flash('error', 'Campground not found');
      } else {
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash('error', 'You don\'t have permission to do that');
          res.redirect('back');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be loggedin to do that.');
    res.redirect('back');
  }
}

middlewareObj.checkCommentOwnerShip = function(req, res, next) {
  if(req.isAuthenticated()){
    Comment.findById(req.params.comment_id, function(err, foundComment){
      if(err){
        console.log(err);
        res.redirect('back');
      } else {
        if(foundComment.author.id.equals(req.user._id)){
          next();
        } else {
          req.flash('error', 'You don\'t have permission to do that.');
        }
      }
    });
  } else {
    req.flash('error', 'You need to be loggedin to do that');
  }
}

middlewareObj.isLoggedIn = function(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  req.flash('error', 'You need to be loggedin to do that.');
  res.redirect('/login');
}

module.exports = middlewareObj;
