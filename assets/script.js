var searchBtn = $("#search-btn");
var flightNum = $("#flight-search");


function getFlightMap(event){
    event.preventDefault()
    console.log(flightNum.val());
    var requestUrl = "http://flightxml.flightaware.com/json/FlightXML2/MapFlight?ident=" + flightNum.val()

    $.ajax({
    url: requestUrl,
    method: "GET",
    dataType: "jsonp",
    jsonp: "jsonp_callback",
    }).then(function (response){
        console.log(response);
        var image = $("#image");
        image.attr("src", "data:image/png;base64," + response.MapFlightResult);
    })
}





searchBtn.on("click", getFlightMap);