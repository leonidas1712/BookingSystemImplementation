//File that defines methods for the 'Your bookings' page. Populating bookings, defining cancel, etc
//Created 24 Oct 2017

//returns user bookings as an array, using the GET route defined in app.js
function getUserBookings(){
  var bookings = [];

  $.ajax({
    url:'/user_bookings',
    type:'GET',
    async:false,
    success:function(response){
      bookings = response;
    }
  });

  return bookings;
}


//returns booking details for each booking that we want to show. If we need more/less
//details, we can change this method to accomodate that. If no bookings are found,
//it simply sets it to "No booking found" for the display fields, so that will be
//displayed to user instead of just an empty table.
function returnBookingDetails(){
  var bookings = getUserBookings();
  var bookingDetails = [];

  //if there are any bookings run this:
  if(bookings.length){
    for(var i = 0; i < bookings.length; i++){
      var startTime = moment(bookings[i].date.startTime);

      //controls formatting for date
      var id = bookings[i]._id;
      var date = startTime.format("dddd MMMM D YYYY, ") + bookings[i].time;
      //space Name
      var space = bookings[i].spaceNameWithSpaces;

      //the final booking object to push into the array
      var booking = {
        id:id,
        date:date,
        space:space
      }

      bookingDetails.push(booking);
    }
  }

  //if no bookings found this is run instead
  else{
    var booking = {
      date:"No bookings found",
      space:"No bookings found"
    }

    bookingDetails.push(booking);
  }

  return bookingDetails;
}

//populates the table with all the booking details, using the methods above.
function populateTable(){
  var table = $("#your-bookings");
  var bookingDetails = returnBookingDetails();

  var tBody = $('tbody');

  //This loops through all the booking details returned and creates a table row for each,
  //filling in the cells appropriately with date and space.
  for(var i = 0; i < bookingDetails.length; i++){
    var tr = $("<tr>");

    //if there were bookings, this if statement will run, because
    //returnBookingDetails doesn't give an id property when no bookings found.
    if(bookingDetails[i].hasOwnProperty('id')){
      var tdDate = $('<td class = "date" title = "Cancel this booking">' + bookingDetails[i].date + '</td>');
      //storing the id in the cell so we can access it when cancelling
      tdDate.data("bookingId",bookingDetails[i].id);
      //console.log("ID: " + tdDate.data("bookingId"));
      tdDate.appendTo(tr);
    }

    //if no bookings found, this code will run. Doesn't assign date class or tooltip,
    //and because there's no date class it won't get the click event, won't have the
    //hover styling.
    else{
      var tdDate = $('<td>' + bookingDetails[i].date + '</td>');
      tdDate.appendTo(tr);
    }

    $('<td>' + bookingDetails[i].space + '</td>').appendTo(tr);

    tr.appendTo(tBody);
  }

  //searches through the cells in the dates column. If it has the class date,
  //it will assign the click event to open the modal. Also stores the
  //bookingId, and the booking string to display to user before cancelling.
  $("#your-bookings td:first-child").each(function(){
    if($(this).hasClass('date')){
      $(this).attr("data-toggle","modal");
      $(this).attr("data-target","#cancel-modal");

      $(this).click(function(){
        $("#cancel-modal").data("bookingId", $(this).data("bookingId"));
        var bookingAndSpace = $(this).text() + " , " + $(this).parent().find("td:nth-child(2)").text();
        $("#booking").text(bookingAndSpace);


      });
    }
  });
}

$(document).ready(function(){
  populateTable();

//when cancel is pressed, we get the bookingId stored earlier and send it to the
//delete_booking route. When it goes to thar route, if the booking is deleted
//successfully it returns an object: {deleted:true}. This is to make it alert and refresh
//the page when deleting is done.
  $("#cancelBtn").click(function(){
    var bookingId = $("#cancel-modal").data("bookingId");
    //console.log("bookingID: " + bookingId);

    $.ajax({
      url:'/delete_booking/' + bookingId,
      type:'GET',
      async:false,
      success:function(response){
        if(response.deleted == true){
          alert("Booking deleted!");
          window.location.reload();
        }
      }
    });


  });


});
