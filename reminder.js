//The reminder class - the loop that checks bookings and sees if it is time to send the reminder.
//Created 23 Oct 2017

//make a function that outputs if a booking is now or not, based on the startDate given
var moment = require('moment');
var mongoose = require('mongoose');
//testDate stores example startDate that you'd have for a booking
var Booking = require('./models/booking');
var Mail = require('./mail');
let account = require('./config/email_user');
const db = require('./config/database');


var MailObj = new Mail(account.user,account.pass);
mongoose.connect(db.url);


//Takes the startDate of the booking and reminder in minutes, returns
//the moment object at which we need to send the e-mail for this
function momentToSend(startDate,reminderInMinutes){
  var reminderInSeconds = reminderInMinutes*60;
  var secondsOfDate = moment(startDate).seconds();
  var momentToSendAt = moment(startDate).seconds(secondsOfDate - reminderInSeconds);

  return momentToSendAt;
}


//outputs whether or not a reminder should be sent right now(true/false), given booking startDate and
//reminder in minutes
function shouldSendReminder(startDate,reminderInMinutes){
  var momentToSendAt = momentToSend(startDate,reminderInMinutes);
  var bookingIsNow = false;

  //checks by minute so it has 60 seconds to check.
  if(momentToSendAt.isSame(moment(),'minute')){
    bookingIsNow = true;
  }

  return bookingIsNow;
}

//sends the reminder email given a bookingObject. Creates email string and sends using
//the MailObj
function sendReminderEmail(bookingObject){
  var firstName = bookingObject.name;
  var spaceName = bookingObject.spaceNameWithSpaces;
  var startDate = moment(bookingObject.date.startTime).format("dddd Do MMMM");
  var startTime = moment(bookingObject.date.startTime).format("h:mma");

  var emailAddress = bookingObject.email;
  var subjectString = "IDEAS Hub Booking";

  var emailString =
    "<p>Dear " + firstName + "," + "<br>"
    + "Your booking for " + spaceName + "is on " + startDate + " at " + startTime
    +"." +  "<br><br>" + "Kind regards," + "<br>" + "IDEAS Hub"
    + "<br><br>" + "Note: This is an automated e-mail. Please do not reply.</p>";

  MailObj.sendMail(emailAddress,subjectString,emailString);
}

//this is the main function. Loops through all the bookings and checks whether
//an email should be sent. If yes, sends the email.
module.exports.checkBookingsAndSendEmails = function(){
  Booking.find({},function(err,bookings){
    console.log('Checking for bookings');
    if(err){
      throw err;
    }

    else{
      for(var i = 0; i < bookings.length; i++){
        var startMoment = moment(bookings[i].date.startTime);
        var reminderInMinutes = bookings[i].reminderInMinutes;

        //if remindertime = now, and emailSent is false, send the email and set emailSent to false.
        if(shouldSendReminder(startMoment,reminderInMinutes) && bookings[i].emailSent == false){
          Booking.findOneAndUpdate({_id:bookings[i].id},{$set:{emailSent:true}},{new:true},function(err,booking){
              if(err){
              throw err;
            }
          });
          //send the e-mail
          sendReminderEmail(bookings[i]);
        }
      }
    }
  });
}
