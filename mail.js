//The Mail class - has the method for sending e-mail, and another one for constructing a cancel email
//Created 23 Oct 2017

var nodemailer = require('nodemailer');
let account = require('./config/email_user');
var moment = require('moment');
//Class for sending e-mail
module.exports = class Mail{
  //constructor to instantiate Mail object
  constructor(user,pass){
    this.user = user;
    this.pass = pass;
    //transporter is used to send mail. Here we are creating the transporter object with its
    //settings
    this.transporter = nodemailer.createTransport({
      service:'gmail',
      auth:{
        user:this.user,
        pass:this.pass
      }
    });
  }

  sendMail(recipientString,subject,contentHTML){
    //mailOptions sets the options for the e-mail we need to send. HTML property can be
    //valid HTML
    const mailOptions = {
      from:this.user,
      to: recipientString,
      subject:subject,
      html:contentHTML
    }

    //transporter.sendMail sends the mail.
    this.transporter.sendMail(mailOptions,function(err,info){
      if(err){
        console.log(err);
        var subject = "Error in sending mail";
        var recipient = this.user;
        var content = "<p> There was an error in sending an e-mail </p>";

        this.sendMail(recipient,subject,content);
      }

      else{
        console.log(info);
      }
    });
  }

  //constructs the delete email given a booking object.
  static constructDeleteEmailHTML(booking){

    var date = moment(booking.date.startTime).format("MMMM D");
    var year = moment(booking.date.startTime).format("YYYY");
    var name = booking.name;
    var spaceName = booking.spaceNameWithSpaces;
    var time = booking.time;

    var emailString =
      "<p>Dear " + name + "," + "<br>"
      + "Your booking for " + spaceName + "on " + date + ", " + time + ", " + year
      +" has been cancelled by the administator. Apologies for the inconvenience." +
       "<br><br>" + "Kind regards," + "<br>" + "IDEAS Hub"
      + "<br><br>" + "Note: This is an automated e-mail. Please do not reply.</p>";

    return emailString;
  }
}
//There is no way to check if the email was successfully received.
//However, if there is an error we can send a mail to the admin.
