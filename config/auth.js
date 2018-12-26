//To store the details for the Google Client that handles login.
//Created 7 Sep 2017
module.exports = {
  'googleAuth':{
    'clientID': process.env.CLIENT_ID,
    'clientSecret': process.env.CLIENT_SECRET,
    'callbackURL': '/auth/google/callback'
  }
}


//'http://localhost:3000/auth/google/callback'
