var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/auth/google', passport.authenticate('google', {
  //telling it what to look for in the account(scope), so profile(for name,id) and email
  scope: ['profile','email']
}));

//This is a callback that executes after login is done.
router.get('/auth/google/callback',passport.authenticate('google',{
  //redirect to 'account_page' if succeeded in logging in, if not go to index
  successRedirect: '/account_page',
  failureRedirect: '/',
  failureFlash:true
}));

module.exports = router;
