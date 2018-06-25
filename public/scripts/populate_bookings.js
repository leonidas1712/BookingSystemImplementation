//File for populating the bookings schedule.
//Created 8 Sep 2017

//removes all bookings from table. Used for when going to the next or previous week
function removeAllBookings(){
  //Below selector selects all table cells NOT in the first column.
  //It then looks through and sees if it has the class booked, if it does, removes
  //the class and takes out the name by setting the HTML to a blank string.
  $("#bookings-table td:not(:first-child)").each(function(){
    if($(this).hasClass('booked')){
      $(this).removeClass('booked');

    }
    $(this).html(' ');
  });

  };

//gets the bookings based on week number, and selected space, then uses them to
//fill the table with the bookings,while assigning the 'booked' HTML class to any filled
//table cells
function populateBookings(isoWeekNum){
  console.log("isoWeek from populate: " + isoWeekNum);
  console.log(getSelectedSpace());
  $.ajax({
    type:'GET',
    async:false,
    url:'/bookings/' + isoWeekNum + '/' + getSelectedSpace(), //uses space name and week number to get the bookings

    //success function : receives a response string consisting of an array
    //of booking objects. We will have to convert the JSOn string into
    //valid JSON first
    success:function(response){
      var responseArr = JSON.parse(response);
      console.log(responseArr);

      //checks if there is anything in the array, only then runs the below.
      if(Array.isArray(responseArr) && responseArr.length > 0){
        //Loop through all the table cells(td)
        $('td').each(function(){
          //find day corresponding to this table cell.
          var dayFromTable = $(this).closest('table').find('th').eq(this.cellIndex).text(); //finds the td's header(day)
          dayFromTable = dayFromTable.replace(/\s+/g, ''); //takes out any spaces
          //find time corresponding to table cell
          var timeFromTable = $(this).parent().find("td").first().text(); //finds the td's time(first td of its row)
          timeFromTable = timeFromTable.replace(/\s+/g, ''); //takes out any spaces
          //loop through the bookings array sent as response
          for(var i = 0; i < responseArr.length; i++){
            //find day from the booking
            var dayFromBooking = moment(responseArr[i].date.startTime).format("dddd");
            dayFromBooking = dayFromBooking.replace(/\s+/g, '');
            //find time from booking.
            var timeFromBooking = responseArr[i].time;
            timeFromBooking = timeFromBooking.replace(/\s+/g, '');
            //find name from booking.
            var name = responseArr[i].name.split(" ")[0];
            name = name.replace(/\s+/g, '');
            //find the weeknumber in which the booking takes place.
            var bookingIsoWeekNumber = moment(responseArr[i].date.startTime).isoWeek();
            //get the _id of the booking as it is in the database, so we can access it
            //when cancelling bookings from the admin side.
            var bookingId = responseArr[i]._id;
            //if day and time of the object match day and time of the cell, print the name in the cell
            if(dayFromTable == dayFromBooking && timeFromBooking == timeFromTable && bookingIsoWeekNumber == isoWeekNum){
              //sets the text of the table cell to the name of the user who booked.
              $(this).text(name);
              //gives the table cell a class of 'booked' we can check later when assigning click events
              //in make_bookings
              $(this).addClass('booked');
              //assign the bookingId as an attribute to the cell.
              $(this).data("bookingId",bookingId);
              console.log($(this).data("bookingId"));
            }

          }
        });
      }


    }
  });
}

//This sets the schedule header based on the week number
function setScheduleHeader(pageWeekNum){
  var startOfWeek = moment().isoWeek(pageWeekNum).weekday(1).format("MMMM D");
  var endOfWeek = moment().isoWeek(pageWeekNum).weekday(5).format("MMMM D");
  $("#startOfWeek").text(startOfWeek + " to ");
  $("#endOfWeek").text(endOfWeek);
}

//requests and gets the maxWeekNumber possible
function getMaxWeekNum(){
  var maxWeekNum = 0;
  $.ajax({
    type:'GET',
    url:'/maxWeekNum',
    async:false,
    success:function(response){
       maxWeekNum = parseInt(response);
    }
  });

  return maxWeekNum;
}

//gets the space currently selected in the dropdown. Upon page load, this is just
//the first space.
function getSelectedSpace(){
  var selectedVal = $(".dropdown-menu li a").parents(".dropdown").find('.btn').text();
  return selectedVal;
}

//function that returns the settings for the table given the spaceName selected.
function getSettings(spaceName){
  //create variables to store the days and times we can assign later when we getSettings
  console.log(spaceName + 'endtext');
  var days = [];
  var times = [];
  $.ajax({
    url:'/getSettings/' + spaceName , //asking a route for the settings for that space with that name
    async:false,
    type:'GET',
    success:function(response){
      console.log("Settings:");
      console.log(response);

      days = response.days;
      times = response.times;

    }
  });

  return{
    days:days,
    times:times
  }
}

//draws the table given the spaceName selected. Can be called after destroyTable
function drawTable(spaceName){
  //get the settings for the selected space
  var settings = getSettings(spaceName);

  //assign them to variables. These are arrays we can loop through.
  var times = settings.times;
  var days = settings.days;

  //set table to the selector.
  var table = $('#bookings-table');
  //create header. The row with all the headers has id 'timesRow'
  $('<thead><tr id = "timesRow"><th> Times </th>').appendTo(table);

  var timesRow = $('#timesRow');

  //Loops through days and creates header tags for each. Determines number of columns
  for(var i = 0; i < days.length; i++){
    $('<th>' + days[i] + '</th>').appendTo(timesRow);
  }

  $('<tbody>').appendTo(table);
  var tBody = $('tbody');

  //Loops through times and creates a row for each, and also
  //creates the appropriate number of table cells for each row
  //depending on columns. Determines number of rows
  for(var i = 0; i < times.length; i++){
    var tr = $('<tr>');
    $('<td class = "time">' + times[i] + "</td>").appendTo(tr);

    for(var j = 0; j < days.length; j++){
      $('<td title = "Make a booking"> </td>').appendTo(tr);
    }
    tr.appendTo(tBody);
  }
}

//destroys the entire table so that it can be redrawn.
//recursive loop that removes the children of table until there are no more
function destroyTable(){
  //recursive loop that removes the children of table until there are no more
  var table = document.getElementById("bookings-table");
  while (table.firstChild) {
      table.removeChild(table.firstChild);
  }
}

//this function disables and enables the next and previous week buttons based on
//the page week number
function enableAndDisableButtons(pageWeekNum,maxWeekNum){
  if(pageWeekNum == moment().isoWeek()){
    //if it's just the current week, disable previous week button, but
    //make next week clickable.
    $("#next-week").prop("disabled",false);
    $("#prev-week").prop("disabled",true);


  }

  else if(pageWeekNum >= maxWeekNum){
    //if it's at the limit, disable the next week button and enable the
    //previous week button.
    $("#next-week").prop("disabled",true);
    $("#prev-week").prop("disabled",false);

  }

  else if(pageWeekNum > moment().isoWeek()){
    //if it's just bigger than the current week number but not at limit,
    //enable both.
    $("#next-week").prop("disabled",false);
    $("#prev-week").prop("disabled",false);


  }

}
//sets the dropdown button text to the value of the first option upon page load
function setDropdownButton(){
  //sets the html to the text of the first option + the caret.
  $(".dropdown-menu li a").parents(".dropdown").find('.btn').html($(".dropdown-menu li:first a").text() + ' <span class="caret"></span>');
  $(".dropdown-menu li a").parents(".dropdown").find('.btn').val($(".dropdown-menu li:first a").data('value'));
}

//this function puts together all the above functions so we can use it when
//loading the page upon visiting, or upon clicking next week or previous week buttons
function loadPage(pageWeekNum, maxWeekNum){
  //first set the schedule header.
  setScheduleHeader(pageWeekNum);
  //set up buttons
  enableAndDisableButtons(pageWeekNum,maxWeekNum);
  //removes all bookings. used especially when switching week number.
  removeAllBookings();
  //finally populate it.
  populateBookings(pageWeekNum);
}


$(document).ready(function(){
  //storing weekNumber and year in the bookingsTable so we can use it
  //later to make bookings
  if(!$("bookings-table").data("weekNumber")){
    //when page loads, if it's empty it will populate the field
    //if not empty, that means a button was clicked so it's ok
    //even if we press previous till we're down to the currentWeekNum, still ok
    $("#bookings-table").data("weekNumber", moment().isoWeek());
  }

  else{
    //do nothing
  }
  //$("#bookings-table").data("weekNumber", moment().isoWeek());

  //storing the current year. TODO:change it so that it's based on weekNumber,
  //i.e it should increase if we're back at 0 again.


//get the current week number for the page
var pageWeekNum = $("#bookings-table").data("weekNumber");

var year = moment().isoWeek(pageWeekNum).year();
$("#bookings-table").data("year", year);

//gets the max week number alloed
var maxWeekNum = getMaxWeekNum();
console.log("MaxWeekNum: " + maxWeekNum);

//defining what happens when previous week button is clicked
$("#prev-week").click(function(){
  //if NOT(pageWeekNum equals realtime currentWeekNum), decrease
  if(!(pageWeekNum <= moment().isoWeek())){
    pageWeekNum = pageWeekNum - 1;
    $("#bookings-table").data("weekNumber", pageWeekNum);
    console.log("prevWeek pageWeekNum: " + pageWeekNum);
    loadPage(pageWeekNum, maxWeekNum);


  }

});

//if next week is clicked, make sure page week number is not at limit.
//then increase pageWeekNum and pass it into load page. Also store it in the page.
$("#next-week").click(function(){
  if(!(pageWeekNum >= maxWeekNum)){
    pageWeekNum = pageWeekNum + 1;
    $("#bookings-table").data("weekNumber", pageWeekNum);
    console.log("nextWeek pageWeekNum: " + pageWeekNum);
    loadPage(pageWeekNum,maxWeekNum);
  }
});

//defines what happens when a new setting from the dropdown is clicked
$(".dropdown-menu li a").click(function(){
  //set it to the new selected value
  $(this).parents(".dropdown").find('.btn').html($(this).text() + ' <span class="caret"></span>');
  $(this).parents(".dropdown").find('.btn').val($(this).data('value'));

  //destroy the table, then draw the table using the new selected space and populate.
  destroyTable();
  console.log('get selected:' + getSelectedSpace() + 'end');
  drawTable(getSelectedSpace());
  populateBookings(pageWeekNum);
});



//Sets the dropdown button the value of the first element upon loading
setDropdownButton();
var spaceName = getSelectedSpace();
//draw table based on selected space name
drawTable(spaceName);

loadPage(pageWeekNum, maxWeekNum);

//running populate every second so that if a new booking is made
//the user can see it without having to refresh the page.
setInterval(function(){
  console.log("running");
  populateBookings(pageWeekNum);
},1000);


});
