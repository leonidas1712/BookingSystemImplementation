//1. Make sure settings collection is not empty - add settings object with weeksAhead
//var Setting = mongoose.model('Setting',settingsSchema);
//mongoose.connect('mongodb://localhost/bookings');

/*Setting.findOne({},function(err,obj){
  console.log(obj);
})
//var s = new Setting({weeksAhead:4});
/*s.save((err)=>{
  if(err){
    throw err;
  }
});*/

//2. Add some spaces to the spaces collection

/*var Space = mongoose.model('Space',spaceSchema);
mongoose.connect('mongodb://localhost/bookings');

var space1 = new Space({
  name:'Green Screen Room 1',
  days:["Monday","Tuesday","Wednesday","Thursday","Friday"],
  times:[
    {start:"12:45pm",end:"1:15pm"},
    {start:"1:15pm",end:"1:45pm"},
    {start:"1:45pm",end:"2:15pm"}
  ]
});

var space2 = new Space({
  name:'Green Screen Room 2',
  days:["Monday","Tuesday","Wednesday","Thursday"],
  times:[
    {start:"12:45pm",end:"1:15pm"},
    {start:"1:15pm",end:"1:45pm"},
    {start:"1:45pm",end:"2:15pm"}
  ]
});

space1.save((err)=>{
  if(err){
    throw err;
  }
});

space2.save((err)=>{
  if(err){
    throw err;
  }
});*/

//3. Set admin account through Passport - put before the school email check

/*else if(profile.emails[0].value == 'ideashubbookingsystem@gmail.com'){
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
