var express = require('express');
var router = express.Router();

var Space = require('../models/space');
//Index page(landing page)
router.get('/',(req,res)=>{
  //Find and pass in array of spaces with the names. Used to populate dropdown.
  Space.getSpaceNames(function(err,spaces){
    if(err){
      throw err;
    }
    else{
      res.render('index',{
        spaces:spaces
      });
    }
  });
});

router.get('/account_page',isLoggedIn, (req,res)=>{
  //USES SETTINGS
  //if user is not administrator, proceed to account page.
  if(!req.user.isAdmin){
    Space.getSpaceNames(function(err,spaces){
      res.render('account_page',{
        firstName:req.user.firstName,
        spaces:spaces
      });

    });
  }

  //if user is admin, redirect to admin_page
  else{
    res.redirect('/admin_page');
  }
});



  //get route for your_bookings page.
  router.get('/your_bookings',isLoggedIn,(req,res)=>{
        res.render('your_bookings',{
          firstName:req.user.firstName
        });
  });

  //get route for admin page.
  router.get('/admin_page',isAdmin,(req,res)=>{
    Space.getSpaceNames(function(err,spaces){
      res.render('admin_page',{
        firstName:req.user.firstName,
        spaces:spaces
      });
    });
  });

  router.get('/admin_settings',isAdmin,(req,res)=>{
    res.render('admin_settings',{
      firstName:req.user.firstName
    })
  });


//this route handles logging out.
router.get('/logout',(req,res)=>{
  req.logout();     //logout is a function Passport adds to Express somehow
  res.redirect('/');
});

function isLoggedIn(req,res,next){
  //checks if user is authenticated(logged in)
  if(req.isAuthenticated()){
    return next();
  }

  else{
    //flashes a message that says 'please login to view a profile' if you
    //try to access /profile without logging in.
    req.flash('danger','Please login to access that page');
    res.redirect('/');
  }
}

function isAdmin(req,res,next){
  //logged in and admin
  if(req.isAuthenticated() && req.user.isAdmin == true){
    return next();
  }

  //logged in but not admin
  else if(req.isAuthenticated()){
    req.flash('danger','You must be logged in as an administator to access that page');
    res.redirect('/account_page');
  }

  //not logged in
  else{
    req.flash('danger','You must be logged in as an administator to access that page');
    res.redirect('/')
  }
}

module.exports = router;
