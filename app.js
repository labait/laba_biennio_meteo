
var is_debug = true;
var provider = "openweathermap";

$(function(){
  showSection("loading")
  init();
})


function init(){
  //alert("ciao")
  getPosition()
}


function showSection(section){
  $("section").hide()
  $("#"+section).show()
}


function getPosition(){
  debug("find position...")
  if(is_debug){ // if debug use fake location
    getWeather(45.559394399999995, 10.2037211)
  } else {
    navigator.geolocation.getCurrentPosition(function(position) {
      debug(position)
      getWeather(position.coords.latitude,position.coords.longitude)
    });
  }
}


function getWeather(lat, lng) {
  debug("getting weather from "+provider+" of lat:" + lat+", lng: "+lng)

  if(provider=="simpleweather") {
    $.simpleWeather({
      location: lat+","+lng,
      woeid: '',
      unit: 'c',
      success: function(w){
        renderWeather(w)
      },
      error: function(){
        debug("ERROR! receiving meteo")
      }
    })
    return; // exit function
  }

  if(provider=="openweathermap") var url = "http://api.openweathermap.org/data/2.5/forecast/daily?cnt=7&units=metric&lat="+lat+"&lon="+lng+"&appid=581881e2788f16b15fe091b3bb64ce37"
  if(provider=="darksky") var url = "https://api.darksky.net/forecast/00c7658658103952f0566b7c8d854765/"+lat+","+lng

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    //alert('Response from CORS request to ' + url);
    var json = JSON.parse(xhr.responseText);
    renderWeather(json)
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}

function renderWeather(data){
  console.log(data)
  showSection("weather")
  renderBackground()
  if(data){
    for(var i in data.list) {
      var element = $("#weather > .row > .condition")
      element.find(".city .value").text(data.city.name)
      if(i!=0) element = element.clone().appendTo( "#forecast" ); // duplicate condition
      condition = data.list[i]
      var date = new Date(condition.dt*1000);
      day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][date.getDay()]
      element.find(".icon i").addClass("wi-owm-"+condition.weather[0].id)
      element.find(".date .value").text(day)
      element.find(".temp .min .value").text(condition.temp.min)
      element.find(".temp .max .value").text(condition.temp.max)
      element.find(".wind .value").text(condition.speed+"ms")
      element.find(".humidity .value").text(condition.humidity+"%")
      element.find(".clouds .value").text(condition.clouds+"%")
      element.find(".description .value").text(condition.weather[0].description)
    }
    $("#weather > .row > .condition").addClass("col-md-4 col-md-offset-4")
    $("#weather #forecast > .condition").addClass("col-md-2 col-sm-4")
  } else {
    alert("sorry, no weather info!")
  }
}


function renderBackground(){
  var date = new Date();
  var hours = date.getHours();
  if(hours >= 5) moment = "sunrise";
  else if(hours >= 7) moment = "morning";
  else if(hours >= 12) moment = "afternoon";
  else if(hours >= 17) moment = "sunset";
  else if(hours >= 18) moment = "twilight";
  else if(hours >= 20) moment = "evening";
  else if(hours >= 22) moment = "night";
  var background_image = "background-"+moment+".jpg"
  //$("body").css("background-image", "url('"+background_image+"')") #TODO
  console.log(background_image)
}


function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // XHR for Chrome/Firefox/Opera/Safari.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // XDomainRequest for IE.
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}


function debug(obj){
  console.log(obj)
}
