//This file: assigns the table cells that have bookings the click events needed to
//cancel/delete the booking. Inside this click event, ajax request made
//with the bookingId for that cell, which will go to a route that deletes the booking
//and sends the e-mail.

//Created 25 Oct 2017

//takes the bookingId and sets the fields of the cancel-modal appropriately
function setBookingFields(id){
  $.ajax({
    url:'/bookingById/' + id,
    type:'GET',
    async:false,
    success:function(response){
      var booking = response;

      var date = moment(booking.date.startTime).format("dddd MMMM D YYYY");
      $("#date").text(date);

      var time = booking.time;
      $("#time").text(time);

      var space = booking.spaceNameWithSpaces;
      $("#space").text(space);

      var name = booking.name;
      $("#name").text(name);
    }
  });
}

//This function assigns the appropriate table cells(booked cells) a click function
//for cancelling. Is run everytime table is destroyed/changed.
function cancelBooking(){
  $("#bookings-table td:not(:first-child)").each(function(){
    if($(this).hasClass("booked") == true){
      //console.log("YWS");
      $(this).attr("data-toggle","modal");
      $(this).attr("data-target","#cancel-modal");
      //console.log("YWS");

      $(this).click(function(){
        //console.log("ID: " + $(this).data("bookingId"));
        var id = $(this).data("bookingId");

        $("#cancel-modal").data("bookingId",id);
        setBookingFields(id);
        });
      };
    })
}

$(document).ready(function(){
  //because in populate this button clears any booked cells, so they don't have the click
  //event assigned.
  $("#next-week").click(function(){
    cancelBooking();
  });

  //because in populate this button clears any booked cells, so they don't have the click
  //event assigned.
  $("#prev-week").click(function(){
    cancelBooking();
  });

//when changing spaces, the entire table is destroyed so a new table can be made,
//so all the tds need to be assigned their click events again
  $(".dropdown-menu li a").click(function(){
    cancelBooking();
  });

  //get the bookingId stored, then use it to cancel the booking.
  $("#cancelBtn").click(function(){
    var id = $("#cancel-modal").data("bookingId");
    $.ajax({
      url:'/cancel_booking/' + id,
      type:'GET',
      async:false,
      success:function(response){
        alert("Booking cancelled!");
        window.location.reload();
      }
  });
});

  //Upon page load, need to assign the click events.
  cancelBooking();
});
