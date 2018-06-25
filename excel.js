//This is the Excel class - has the methods for reading the bookings, error checking, and saving.
//Created 5 Nov 2017

var path = require('path');

var XLSX = require('xlsx');
var Booking = require('./models/booking');
var mongoose = require('mongoose');
var moment = require('moment');
//Excel - Class that contains a method for reading the file and importing bookings.
//Other methods in the class used within it to perform intermediary functions.
module.exports = class Excel{
  //class constructor method
  constructor(){
    this.reminderArray = ["none", "4h","12h","1d","1w"];
    this.workbook = XLSX.readFile(path.join(__dirname,'uploads/excel.xlsx'));
    this.firstSheetName = this.workbook.SheetNames[0];
    this.bookings = XLSX.utils.sheet_to_json(this.workbook.Sheets[this.firstSheetName]);
  }
  //function to return headers of the Excel sheet

  get headers() {
      var headers = [];
      var sheet = this.workbook.Sheets.Sheet1
      var range = XLSX.utils.decode_range(sheet['!ref']);

      var C, R = range.s.r; /* start in the first row */
      /* walk every column in the range */
      for(C = range.s.c; C <= range.e.c; ++C) {
          var cell = sheet[XLSX.utils.encode_cell({c:C, r:R})] /* find the cell in the first row */

          var hdr = "UNKNOWN " + C; // <-- replace with your desired default
          if(cell && cell.t) hdr = XLSX.utils.format_cell(cell);

          headers.push(hdr);
      }

      //returns headers row without 'unknown' - ADDED BY ME
      headers = headers.filter(function(header){
        return !header.includes('UNKNOWN');
      });
      return headers;
  }
  //function to return fields associated with time for a booking
  generateTimeFields(booking){
    //replace spaces from Excel and construct time string e.g '12:45pm-1:15pm' make times lowecase so PM/pm and am/AM doesn't matter
    var time = booking.startTime.replace(/\s+/g, '').toLowerCase() + '-' + booking.endTime.replace(/\s+/g, '').toLowerCase();
    //get moment object from day String

    //create timestrings to create moments from - make times lowecase so PM/pm and am/AM doesn't matter
    var startTimeString = booking.date + "-" +  booking.startTime.replace(/\s+/g, '').toLowerCase();
    var endTimeString = booking.date + "-" +  booking.endTime.replace(/\s+/g, '').toLowerCase();

    //create startTime and endTime Date objects
    console.log(moment(startTimeString,"D-MMM-YY-hh:mma"));
    var startTime = moment(startTimeString, "D-MMM-YY-hh:mma").toDate();
    var endTime = moment(endTimeString, "D-MMM-YY-hh:mma").toDate();

    return {
      time:time,
      startTime:startTime,
      endTime:endTime
    }

  }
  //function to create and then save a booking from Excel sheet
  createAndSaveBooking(booking){
    var timeFields = this.generateTimeFields(booking);

    var newBooking = new Booking();

    newBooking.name = booking.name;
    newBooking.email = booking.email.replace(/\s+/g, '');
    newBooking.time = timeFields.time;
    newBooking.date.startTime = timeFields.startTime;
    newBooking.date.endTime = timeFields.endTime;
    newBooking.space = booking.space.replace(/\s+/g, '');
    newBooking.spaceNameWithSpaces = booking.space + " ";
    newBooking.reminder = booking.reminder.replace(/\s+/g, '');
    newBooking.emailSent = false;

    newBooking.save(function(err){
      if(err){
        throw err;
      }
    });

  }
  //function to check if a row is missing any properties(any blanks)
  missingProps(booking){
    var headers = this.headers;

    var missingProp = false;
    headers.forEach((header)=>{
      if(!booking.hasOwnProperty(header)){
        missingProp = true;
      }
    });

    return missingProp;
  }
  //function to validate booking fields from Excel row
  validateBookingFields(booking){
    var isErr = false;
    var errorCode = 0;

    //1.Each row must not have blanks.
    //check if the booking is missing props.
    if(this.missingProps(booking)){
      //errorMsg = errorMsg + "No fields for each booking are blank\n\n";
      errorCode = 1;
      isErr = true;
    }

    else{
      //2. Email must end with @gapps.uwcsea.edu.sg

      if(!booking.email.endsWith('@gapps.uwcsea.edu.sg')){
        //errorMsg = errorMsg + "The e-mail for each booking is a UWCSEA email address.\n\n"
        errorCode = 2;
        isErr = true;
      }

      //3 and 4 - doesn't really work
      try{
        var timeFields = this.generateTimeFields(booking);
      }

      catch(e){
        var isErr = true;
        //var errorMsg = errorMsg + "The date is in the format D-MMM-YY e.g 7-Nov-17, and times are 12 hour and hh:mma, e.g 1:45pm\n\n"
        errorCode = 3;
      }

      //5.Check reminder options
      var reminder = booking.reminder.toLowerCase().replace(/\s+/g, '');
      if(this.reminderArray.indexOf(reminder) == -1){
        isErr = true;
        //errorMsg = errorMsg + "The reminder option is either of: " + reminderArray.join(',');
        errorCode = 4;
      }
    }

    return{
      isErr:isErr,
      errorCode:errorCode
    }
  }
  //return a string with the error messages needed based on array of errorCodes
  returnErrorMsg(errorCodes){
    var errorMsg = "ERROR: Ensure the following are done:\n\n"
    var errorMessages = {
      1:"No fields for each booking are blank\n\n",
      2:"The e-mail for each booking is a UWCSEA email address.\n\n",
      3:"The date is in the format D-MMM-YY e.g 7-Nov-17, and times are 12 hour and hh:mma, e.g 1:45pm\n\n",
      4:"The reminder option is either of: " + this.reminderArray.join(',')
    }

    //get only unique error codes.
    errorCodes = errorCodes.filter(function(value,index,self){
      return self.indexOf(value) === index;
    });

    //for each error code, add the error msg.
    errorCodes.forEach((errorCode)=>{
      errorMsg = errorMsg + errorMessages[errorCode];
    });

    return errorMsg;
  }
  //MAIN method to call in route - combines methods above
  readAndSaveBookings(){
    //tracks if there is at least one error.
    var isErr = false;
    //list of errorCodes if there are errors.
    var errorCodes = [];

    //loops through booking rows in the sheet- if there is an error, push the error code into the array.
    this.bookings.forEach((booking)=>{
      if(this.validateBookingFields(booking).isErr){
        errorCodes.push(this.validateBookingFields(booking).errorCode);
        isErr = true;
      }
    });

    //if there was at least one error, return the error message string through error codes.
    if(isErr){
      return this.returnErrorMsg(errorCodes);
    }

    //if there weren't any errors, just save each booking through createAndSaveBooking method
    //returns undefined when called - if this is returned in route, there was no error.
    else{
      this.bookings.forEach((booking)=>{
        this.createAndSaveBooking(booking);
      });
    }
  }
}



//https://stackoverflow.com/questions/37733966/get-the-given-date-format-the-string-specifying-the-format-in-javascript-or-mo
//Above link is for specifying multiple different possible time parser formats
//https://stackoverflow.com/questions/30859901/parse-xlsx-with-node-and-create-json


//https://github.com/SheetJS/js-xlsx/issues/214 - For get_header_row

//returns the headers without the unknowns.
