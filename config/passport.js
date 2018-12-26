//The file that handles gmail login through PassportJS library(passport-google-oauth).
//Created 7 Sep 2017

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var User = require('../models/user');
var configAuth = require('./auth');
var adminEmail = require('./email_user');

module.exports = function(passport){
  //this allows us to access the user object from app.js, which is very useful.
  passport.serializeUser((user,done)=>{
    done(null,user.id); //only user id is serialized to the session
  });

  //this removes the user object from the session
  passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
      done(err,user);
    });
  });
      //defining which login strategy we are using
      passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        passReqToCallback:true
      },
      //this function is called when a user is logging in, based on OAuth 2.0
      //OAuth is a way to authenticate users
      //Profile is an object that refers to the Gmail account that is attempting to sign in.
      function(req,accessToken, refreshToken, profile, done){
        //Checks if the user exists
        User.findOne({
          'google_id':profile.id
        }, (err,user)=>{
          //if there was an error, returns that there was an error
          if(err){
            return done(err);
          }
          //if user exists, everything is fine.
          else if(user){
            return done(null,user);
          }

          /*
          else if(profile.emails[0].value == 'ideashubbookingsystem@gmail.com'){
            var newUser = new User();
            newUser.google_id = profile.id;
            newUser.token = accessToken;
            newUser.name = profile.displayName;
            newUser.email = profile.emails[0].value;
            newUser.isAdmin = true;

            newUser.save((err)=>{
              if(err){
                throw err;
              }

              else{
                return done(null,newUser);
              }
            });

          }*/

          //if the email used is not a school email, return a message. Redirects them to index and displays the message.
          else if(!(profile.emails[0].value.endsWith('@gapps.uwcsea.edu.sg'))){
            return done(null,false,req.flash('danger','Please use a school gmail account to login'));
          }



          //if user doesn't exist, but no error, create a new User.
          else{

              var newUser = new User();
              newUser.google_id = profile.id;
              newUser.token = accessToken;
              newUser.name = profile.displayName;
              newUser.email = profile.emails[0].value;
              newUser.isAdmin = false;

              newUser.save((err)=>{
                if(err){
                  throw err;
                }

                else{
                  return done(null,newUser);
                }
              });


          }
        });
      }
    )
  );
}
