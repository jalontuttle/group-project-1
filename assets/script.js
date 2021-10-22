var searchBtn = $("#search-btn");
var flightNum = $("#flight-search");
var city = $("#city-search");
var cityBtn = $(".dropdown-menu")
var cityArray = [];

// Flight function
function getFlightMap(event){
    event.preventDefault()
    console.log(flightNum.val());
    var requestUrl = "https://flightxml.flightaware.com/json/FlightXML2/MapFlight?ident=" + flightNum.val()

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

function getForecast(event){
    event.preventDefault();
    var urlForecast = "https://api.openweathermap.org/data/2.5/forecast?q=" + city.val() + "&appid=0fca51a84b3c432b1ebeba8243768907&units=imperial";
    console.log(urlForecast)
    fetch(urlForecast).then(response =>{
        console.log(response);
        return response.json();
    }).then(data =>{
        console.log(data);
        var pic1 = "https://openweathermap.org/img/w/" + data.list[0].weather[0].icon + ".png"
        var date1 = $("#date1");
        var icon1 = $("#icon1")
        var temp1 = $("#temp1");
        var wind1 = $("#wind1");
        var humidity1 = $("#humidity1");

        var pic2 = "https://openweathermap.org/img/w/" + data.list[1].weather[0].icon + ".png"
        var date2 = $("#date2");
        var icon2 = $("#icon2")
        var temp2 = $("#temp2");
        var wind2 = $("#wind2");
        var humidity2 = $("#humidity2");

        var pic3 = "https://openweathermap.org/img/w/" + data.list[2].weather[0].icon + ".png"
        var date3 = $("#date3");
        var icon3 = $("#icon3")
        var temp3 = $("#temp3");
        var wind3 = $("#wind3");
        var humidity3 = $("#humidity3");

        var pic4 = "https://openweathermap.org/img/w/" + data.list[3].weather[0].icon + ".png"
        var date4 = $("#date4");
        var icon4 = $("#icon4")
        var temp4 = $("#temp4");
        var wind4 = $("#wind4");
        var humidity4 = $("#humidity4");

        var pic5 = "https://openweathermap.org/img/w/" + data.list[4].weather[0].icon + ".png"
        var date5 = $("#date5");
        var icon5 = $("#icon5")
        var temp5 = $("#temp5");
        var wind5 = $("#wind5");
        var humidity5 = $("#humidity5");

        date1.text(moment().add(1, "days").format("MM Do YYYY"));
        icon1.html("<img src=" + pic1 + " />");
        temp1.text("Temperature: " + data.list[0].main.temp);
        wind1.text("Wind: " + data.list[0].wind.speed);
        humidity1.text("Humidity: " + data.list[0].main.humidity);

        date2.text(moment().add(2, "days").format("MM Do YYYY"));
        icon2.html("<img src=" + pic2 + " />");
        temp2.text("Temperature: " + data.list[1].main.temp);
        wind2.text("Wind: " + data.list[1].wind.speed);
        humidity2.text("Humidity: " + data.list[1].main.humidity);

        date3.text(moment().add(3, "days").format("MM Do YYYY"));
        icon3.html("<img src=" + pic3 + " />");
        temp3.text("Temperature: " + data.list[2].main.temp);
        wind3.text("Wind: " + data.list[2].wind.speed);
        humidity3.text("Humidity: " + data.list[2].main.humidity);

        date4.text(moment().add(4, "days").format("MM Do YYYY"));
        icon4.html("<img src=" + pic4 + " />");
        temp4.text("Temperature: " + data.list[3].main.temp);
        wind4.text("Wind: " + data.list[3].wind.speed);
        humidity4.text("Humidity: " + data.list[3].main.humidity);

        date5.text(moment().add(5, "days").format("MM Do YYYY"));
        icon5.html("<img src=" + pic5 + " />");
        temp5.text("Temperature: " + data.list[4].main.temp);
        wind5.text("Wind: " + data.list[4].wind.speed);
        humidity5.text("Humidity: " + data.list[4].main.humidity);
        
        })
};

cityBtn.on("click", getForecast);
searchBtn.on("click", getFlightMap);
searchBtn.on("click", getForecast);

//Set local storage
function renderCities(){
    cityBtn.innerHTML = "";
    
    for(var i = 0; i < cityArray.length; i++){
        var btn = cityArray[i];

        var li = document.createElement("button");
        li.textContent = btn
        li.setAttribute("data-index", i);

        cityBtn.append(li);
    }
}

function init(){
    var storedCities = JSON.parse(localStorage.getItem("cities"));

    if(storedCities !== null){
        cityArray = storedCities
    
    }

    renderCities();
}

function storeCities(){
  localStorage.setItem("cities", JSON.stringify(cityArray));  
}

searchBtn.on("click", function(event){
    event.preventDefault();

    var cityText = city.val();

    if(cityText === ""){
        return;
    }
    cityArray.push(cityText);

    storeCities();
    renderCities();
})

init();
