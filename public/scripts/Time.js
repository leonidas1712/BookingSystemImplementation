//returns the startTime and endTime as Date objects to be used when
//making a booking (make_bookings.js)

//Created 20 Oct 2017

 class Time{

    static startAndEndTimes(day,times,isoWeekNum,year){
    //create a moment set to the day we need
    var isoWeekDay = moment(day,"dddd").isoWeekday();
    //create the time strings to be parsed when creating the two moment objects
    var startTimeString = isoWeekDay + "-" + times[0] + "-" + isoWeekNum + "-" + year;
    var endTimeString =  isoWeekDay + "-" + times[1] + "-" + isoWeekNum + "-" + year;

    var startDate = moment(startTimeString, "E-hh:mma-WW-YYYY");
    //console.log(startDate.format("E-hh:mma-WW-YYYY"));
    var endDate = moment(endTimeString, "E-hh:mma-WW-YYYY");
    //console.log(endDate.format("E-hh:mma-WW-YYYY"));

    return {
      //use toDate to return native JS Date objects
      startDate:startDate.toDate(),
      endDate:endDate.toDate()
    }

  }
}
