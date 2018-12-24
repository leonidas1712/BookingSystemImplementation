//File that defines methods for making bookings. Assigns click events to the table cells for opening the modal too.
//Created 11 Sep 2017

//takes the row and column of a table cell  and outputs the booking fields needed e.g day, time
function getBookingFields(rowIndex,columnIndex){
  var tableCell = $('#bookings-table tr').eq(rowIndex + 1).find('td').eq(columnIndex);

  //day for Booking
  var day =  $(tableCell).closest('table').find('th').eq(columnIndex).text().replace(/\s+/g, '');
  //timeString - e.g 12:45 - 1:45
  var time =  $(tableCell).parent().find("td").first().text().replace(/\s+/g, '');

  //array of the times so we can get start and end date -e.g [12:45,1:15]
  var times = time.split("-");
  //page isoWeekNumber so we know which weeknumber we are booking for
  var isoWeek = $("#bookings-table").data("weekNumber");

  //year - TODO: make it so that the year stored changes with pagination too
  var year = $("#bookings-table").data("year");

  //start and end times as Date objects
  var startTime = Time.startAndEndTimes(day,times,isoWeek,year).startDate;
  var endTime = Time.startAndEndTimes(day,times,isoWeek,year).endDate;

  //the selected value for the dropdown for space - taking out spaces for sanity
  //.replace(/\s+/g, '')
  var selectedVal = $(".dropdown-menu li a").parents(".dropdown").find('.btn').text().replace(/\s+/g, '');
  var spaceNameWithSpaces = $(".dropdown-menu li a").parents(".dropdown").find('.btn').text();
  //console.log("Selected value from dropdown:" + selectedVal);


  return {
    time:time,
    startTime:startTime,
    endTime:endTime,
    space:selectedVal,
    spaceNameWithSpaces:spaceNameWithSpaces
  }
}

//assigns the click event needed to make bookings to all the tds not booked
//need to run this everytime the table is destroyed or bookings are removed etc
function makeBookings(){
  $("#bookings-table td:not(:first-child)").each(function(){
    if($(this).hasClass("booked") == false){
      //add a click event if it is NOT filled
      $(this).attr("data-toggle","modal");
      $(this).attr("data-target","#booking-modal");
      //Modal trigger
     //sets it so that it opens a modal when clicked
      $(this).click(function(){

        var rowIndex = $(this).closest("tr").index(); //starts from 0
        var columnIndex = $(this).index(); //starts from 1 goes up to number of columns

        $("#booking-modal").data("rowIndex", rowIndex);
        $("#booking-modal").data("colIndex", columnIndex);


      });

    }
  });

}

$(document).ready(function(){
  //because in populate this button clears any booked cells, so they don't have the click
  //event assigned.
  $("#next-week").click(function(){
    makeBookings();

  });

  //because in populate this button clears any booked cells, so they don't have the click
  //event assigned.
  $("#prev-week").click(function(){
    makeBookings();

  });

//when changing spaces, the entire table is destroyed so a new table can be made,
//so all the tds need to be assigned their click events again
  $(".dropdown-menu li a").click(function(){
    makeBookings();
  });

//submit button event when making a booking.
//getsBookingFields, then sends AJAX to make the booking
  $("#submitBtn").click(function(){
    //if none of the buttons in the group are checked, alert to pick one

    //get the booking fields needed, using the table cell's row and column index
    //which were stored upon clicking.
    var rowIndex = $("#booking-modal").data("rowIndex");
    //console.log(rowIndex);
    var colIndex = $("#booking-modal").data("colIndex");

    var bookingFields = getBookingFields(rowIndex,colIndex);

    //If nothing was checked, do an alert.
    if(!$("input[name='reminder']:checked").val()){
      alert("Please pick one of the reminder options!");
    }

    else{
      //get the reminder option picked.
      var reminderValue = $("input[name='reminder']:checked").val();
      //console.log(reminderValue);

      //Make the booking using an ajax request.
      $.ajax({
        type:'GET',
        url:'/get_user',         //getting the user object so we can make a booking
        success:function(response){
          //response object is the user object
          $.ajax({
            type: 'POST',
            url:'/make_booking',
            data: {
              id:response._id,
              name:response.name,
              email:response.email,
              timeString:bookingFields.time,
              startTime: bookingFields.startTime,
              endTime: bookingFields.endTime,
              reminder:reminderValue,
              space:bookingFields.space,
              spaceNameWithSpaces:bookingFields.spaceNameWithSpaces

            },
            success:function(response){

            }
          });
          //Alert and reload page once booking made.
          alert("Booking saved!");
          window.location.reload();
        }
      });
    }
  });

  //Upon page load, assign click events to non-booked cells.
  makeBookings();

});
