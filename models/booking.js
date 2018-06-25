//The booking schema and class.
//Created 10 Oct 2017

var mongoose = require('mongoose');
var moment = require('moment');

var bookingSchema = mongoose.Schema({
  user_id:String,
  name:String,
  email:String,
  time:String,
  date:{
    startTime:Date,
    endTime:Date
  },
  //the space name with spaces replaced
  space:String,
  //the space name without spaces replaced
  spaceNameWithSpaces:String,
  reminder:String,
  emailSent:Boolean
});

class Booking{
  //returns bookings with that week number
  get isoWeekNum(){
    return moment(this.date.startTime).isoWeek();
  }

  //returns the reminder in minutes based on the user option.
  get reminderInMinutes(){
    switch(this.reminder){
      case 'none':
        return 0;
        break;
      case '4h':
        return 4*60;
        break;
      case '12h':
        return 12*60;
        break;
      case '1d':
        return 24*60;
        break;
      case '1w':
        return 24*60*7;
        break;
      default:
        0;

    }
  }
}
//put the class onto the schema so those methods are accessible.
bookingSchema.loadClass(Booking);

module.exports = mongoose.model('Booking',bookingSchema);
