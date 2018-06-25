//The schema for settings - it just stores weeksAhead(for now). Could make it so it stores allowed reminder values too
//Created 19 Oct 2017

var mongoose = require('mongoose');
var moment = require('moment');

var settingsSchema = mongoose.Schema({
  weeksAhead:Number
});


module.exports = mongoose.model('Setting',settingsSchema);
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
