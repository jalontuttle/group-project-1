var searchBtn = $("#search-btn");
var flightNum = $("#flight-search");


function getFlightMap(event){
    event.preventDefault()
    console.log(flightNum.val());
    var url = "http://flightxml.flightaware.com/json/FlightXML2/MapFlight?q=" + flightNum.val()
}







searchBtn.on("click", getFlightMap);