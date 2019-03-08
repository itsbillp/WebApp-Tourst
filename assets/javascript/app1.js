$(document).ready(function() {

  //GLOBAL VARIABLES
  var selectedEventName = "";
  var selectedVenueCity = "";
  var selectedVenueZip = "";
  var selectedVenueDate = "";
  var selectedTicketPrice = 0;
  
  console.log(`init values: venuecity: ${selectedVenueCity} / venuezip: ${selectedVenueZip} / artist: ${selectedEventName} / price: ${selectedTicketPrice}`);
  
  function displayEventChoices(eventObj) {
    for (var i = 0; i<5; i++) {
      var listDiv = $("<div>").attr("class", "card text-black bg-white mb-3");
  
      // generating variables from JSON response
      var priceRange = Math.floor(Math.random() * (90 - 50) + 50);
      var cardHolder = $("<div>").attr("class", "card-body");
      var eventNameData = eventObj._embedded.events[i].name;
      var eventDatesData = eventObj._embedded.events[i].dates.start.localDate;
      var eventVenueNameData = eventObj._embedded.events[i]._embedded.venues[0].name;
      var eventZipData = eventObj._embedded.events[i]._embedded.venues[0].postalCode;
      var eventCityNameData = eventObj._embedded.events[i]._embedded.venues[0].city.name;
      var eventStateData = eventObj._embedded.events[i]._embedded.venues[0].state.stateCode;
      var eventCityState = eventCityNameData + ", " + eventStateData
   
      // displaying data to DOM
  
      // assemble card element 1: eventPic
      var eventPic = $("<img>").attr("src", eventObj._embedded.events[i].images[4].url).attr("class","card-img-top");
  
      // assemble card elements 2: cardBody
      var eventName = $("<h5>").text(eventNameData).attr("class","text-black");
      var eventDates = $("<p>").text("Date: " + eventDatesData);
      var eventVenueName = $("<p>").text("Venue: " + eventVenueNameData);
      var eventZip = $("<p>").text("Zip: " + eventZipData);
      var eventVenueCity = $("<p>").text(`City: ${eventCityNameData}, ${eventStateData}`);
      var eventPriceDisplay = $("<p>").text("Avg Ticket Price: " + priceRange);
  
      var cardBody = cardHolder.append(
        eventName,
        eventDates,
        eventVenueName,
        eventVenueCity,
        eventZip,
        eventPriceDisplay
      );
      //assemble card elements 3: eventBtn
      var cardFooter = $('<div>').attr("class", "card-footer");
        // loading this button with attr pertaining to needed variables upon select......
      var cardChoose = $('<div>').attr("class", "chooseThis btn btn-block btn-outline-primary").attr("data-cardBody",cardBody).attr("data-eventPic", eventObj._embedded.events[i].images[4].url).attr("data-venuename",eventVenueName).attr("data-eventname",eventNameData).attr("data-eventdate", eventDatesData).attr("data-eventzip", eventZipData).attr("data-eventcity", eventCityState).attr("data-ticketprice", priceRange).text("Select Event");
      var eventBtn = cardFooter.append(cardChoose);
      
      //combine Zord: "eventTotal card"
      var eventTotal = listDiv.append(eventPic, cardBody, eventBtn);
  
      //display to DOM at designated ID
      $("#resultsDisplay").append(eventTotal);
      }
      console.log("results displayed function side");
  };
  ///////////
  function displaySelectedEvent(chosenObj) {
    console.log("Name of event is: " + chosenObj.selectedEventName);
    var selectedDiv = $("<div>").attr("class", "card w-90 text-black bg-white mb-3");
    

    var eventName = $("<h5>").text(chosenObj.selectedEventName).attr("class","text-black");
    var eventDates = $("<p>").text("Date: " + chosenObj.selectedVenueDate);
    var eventVenueName = $("<p>").text("Venue: " + chosenObj.selectedVenueName);
    var eventZip = $("<p>").text("Zip: " + chosenObj.selectedVenueZip);
    var eventVenueCity = $("<p>").text(`City: ${chosenObj.selectedVenueCity}`);
    var eventPriceDisplay = $("<p>").text("Avg Ticket Price: " + chosenObj.selectedTicketPrice);
    
  
    var passpic = $("<img>").attr("src", chosenObj.selectedEventPic).attr("class","card-img-top");

    var cardholder = $("<div>").attr("class", "card-body");
    var passbody = cardholder.append(        
      eventName,
      eventDates,
      eventVenueName,
      eventVenueCity,
      eventZip,
      eventPriceDisplay
    );
  
    var selectedEvent = selectedDiv.append(passpic, passbody);
    $("#resultsDisplay").append(selectedEvent);
  }
  ////////////
  
  // Event listener for all artist submit elements
  $("#submitbtn").on("click", function(event) {
    event.preventDefault();
    console.log("SUBMIT BUTTON CLICKED!");
    $("#resultsDisplay").empty();
    var keyword = $("#inlineFormInput").val(); 
    // Constructing a URL to search Ticketmaster for list of events by keyword entered
    var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + keyword + "&countryCode=US&apikey=Hvspzyaf9sT79FRlHNKREkFSLhoIZkDW";
    
    // getTicketmaster(queryURL);
    $.ajax({url: queryURL, method: "GET" }).then(function(response) {
      var jString = JSON.stringify(response);
      var objEvent = JSON.parse(jString);
  
      var eventNamePrompt = $("<h1>").attr("class","block text-white text-center").text('Event Results for "'+keyword+'"');
      var eventNameDisplay = $("<div>").attr("")
      $("#resultsDisplay").append(
          eventNameDisplay
      );
      
      displayEventChoices(objEvent);
      console.log("results displayed on-click side");
  
      // When user selects an event, the div will be emptied
      // and the selected events data is passed to holding variables 
      // for Bill's script, another form field will be produced asking for location info 
      $(".chooseThis").on("click", function() {
        selectedCardPic = $(this).attr("data-eventPic");
        selectedCardBody = $(this).attr("data-cardBody");
        selectedEventName = $(this).attr("data-eventname");
        selectedVenueName = $(this).attr("data-venuename");
        selectedVenueCity =  $(this).attr("data-eventcity");
        selectedVenueZip =  $(this).attr("data-eventzip");
        selectedVenueDate = $(this).attr("data-eventdate");
        selectedTicketPrice =  $(this).attr("data-ticketprice");
        $("#resultsDisplay").empty();
        $("#userLocation").empty();
        
        console.log("TESTING ONLY DELETE ON FINAL :::  Score! You chose: " + selectedEventName + " at " + selectedVenueCity + " " + selectedVenueZip + " on " + selectedVenueDate + ". Flight options if needed will show below:");
  
        // OBJECT of Selected Event
        var selectedObj = {selectedCardPic, selectedCardBody, selectedEventName, selectedVenueName, selectedVenueCity, selectedVenueZip, selectedVenueDate, selectedTicketPrice}
  
        // TESTING ONLY:
        var chosenPrompt = $("<h1>").attr("class","text-white").text("Score! You chose: " + selectedEventName + " at " + selectedVenueCity + " " + selectedVenueZip + " on " + selectedVenueDate + " for $" + selectedTicketPrice + ". Flight options if needed will show below:");
  
        $("#userLocation").append(chosenPrompt);
        // displaySelectedEvent(selectedObj);
      });
  
    });
  });
  
  });
  