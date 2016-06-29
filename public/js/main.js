var currentMap;
var markers = [];
var dayCount = 4;
var allItineraries = {
    1: {hotel:[], restaurant:[], activity:[], markers:[]},
    2: {hotel:[], restaurant:[], activity:[], markers:[]},
    3: {hotel:[], restaurant:[], activity:[], markers:[]},
    };
var currentDayNum = $(".current-day").text();

$(function initializeMap (){

  var fullstackAcademy = new google.maps.LatLng(40.705086, -74.009151);

  var styleArr = [{
    featureType: 'landscape',
    stylers: [{ saturation: -100 }, { lightness: 60 }]
  }, {
    featureType: 'road.local',
    stylers: [{ saturation: -100 }, { lightness: 40 }, { visibility: 'on' }]
  }, {
    featureType: 'transit',
    stylers: [{ saturation: -100 }, { visibility: 'simplified' }]
  }, {
    featureType: 'administrative.province',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'water',
    stylers: [{ visibility: 'on' }, { lightness: 30 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ef8c25' }, { lightness: 40 }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ visibility: 'off' }]
  }, {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#b6c54c' }, { lightness: 40 }, { saturation: -40 }]
  }];

  var mapCanvas = document.getElementById('map-canvas');

  currentMap = new google.maps.Map(mapCanvas, {
    center: fullstackAcademy,
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: styleArr
  });

});

var iconURLs = {
    hotel: '/images/lodging_0star.png',
    restaurant: '/images/restaurant.png',
    activity: '/images/star-3.png'
  };

function drawMarker (type, name, coords) {
  var latLng = new google.maps.LatLng(coords[0], coords[1]);
  var iconURL = iconURLs[type];
  var marker = new google.maps.Marker({
    icon: iconURL,
    position: latLng
  });
  // var currentDayNum = $(".current-day").text();
  allItineraries[currentDayNum].markers.push({name: name, marker: marker});
  marker.setMap(currentMap);
}  

function removeMarker (name) {
  // var currentDayNum = $(".current-day").text();
  for (var i = 0; i<allItineraries[currentDayNum].markers.length; i++){
      if (allItineraries[currentDayNum].markers[i].name === name){
        allItineraries[currentDayNum].markers.splice(i);
      }
    }
}

function resetMarkers(){
  // var currentDayNum = $(".current-day").text();
  if (!allItineraries[currentDayNum]) return;
  allItineraries[currentDayNum].markers.forEach(function(elem){
      elem.marker.setMap(null);
  })
}

function loadMarkers(){
  // var currentDayNum = $(".current-day").text();
  allItineraries[currentDayNum].markers.forEach(function(elem){
      elem.marker.setMap(currentMap);
  })
}

//Add Items to Itinerary
  $('#options-panel').on("click","button", function(event){
    var type=$(this).prev().data("type");
    var text=($(this).prev()).val();
    var whereToAdd = $(".list-group."+type);
    if (whereToAdd.children().length && type==="hotel") return;
    else if (whereToAdd.children().length >= 3) return;
    else if (whereToAdd.children().text().match(text)) return;
    whereToAdd.append("<div class=\"itinerary-item\"><span data-type="+type+" class=\"title\">"+text+"</span><button class=\"btn btn-xs btn-danger remove btn-circle\">x</button></div>")
    
    // var currentDayNum = $(".current-day").text();
    allItineraries[currentDayNum][type].push(text);

    hotels.forEach(function(hotel){
        if (hotel.name === text){
          drawMarker(type, text, hotel.place.location);
        }
      });
    restaurants.forEach(function(restaurant){
        if (restaurant.name === text){
          drawMarker(type, text, restaurant.place.location);
        }
      });
    activities.forEach(function(activity){
        if (activity.name === text){
          drawMarker(type, text, activity.place.location);
        }
      });
  });

  //Remove Items from Itinerary
  $('#itinerary').on("click", "button", function(event){
    var text=($(this).prev()).text();
    removeMarker(text);
    var type=$(this).prev().data("type");
    // var currentDayNum = $(".current-day").text();
    for (var i = 0; i<allItineraries[currentDayNum][type].length; i++){
      if (allItineraries[currentDayNum][type][i] === text){
        allItineraries[currentDayNum][type].splice(i);
      }
    }
    $(this).parent().remove();
  });

  //Hide Itinerary
  var hideItinerary= function(){
    $(".list-group").children().remove();
  }

  var changeDay = function(newDay){
    if (newDay.text() === "+") return;
    resetMarkers();
    hideItinerary();
    //change current day
    $(".current-day").removeClass("current-day");
    newDay.addClass("current-day");
    //load any saved activities from the day
    currentDayNum = $(".current-day").text();

    var hotel = allItineraries[currentDayNum].hotel[0];
    if (hotel){
      var whereToAdd = $(".list-group.hotel");
      whereToAdd.append("<div class=\"itinerary-item\"><span data-type=\"hotel\" class=\"title\">"+hotel+"</span><button class=\"btn btn-xs btn-danger remove btn-circle\">x</button></div>")
    }
    allItineraries[currentDayNum].restaurant.forEach(function(resto){
      var whereToAdd = $(".list-group.restaurant");
      whereToAdd.append("<div class=\"itinerary-item\"><span data-type=\"restaurant\" class=\"title\">"+resto+"</span><button class=\"btn btn-xs btn-danger remove btn-circle\">x</button></div>")
    })
    allItineraries[currentDayNum].activity.forEach(function(activity){
      var whereToAdd = $(".list-group.activity");
      whereToAdd.append("<div class=\"itinerary-item\"><span data-type=\"activity\" class=\"title\">"+activity+"</span><button class=\"btn btn-xs btn-danger remove btn-circle\">x</button></div>")
    })
    
    loadMarkers();
  }

  //When you click a different day
  $(".day-buttons").on('click', 'button', function(event){
    changeDay($(this));
  })

  //add day
  $('#day-add').on("click", function(event){
    allItineraries[dayCount] = {hotel:[], restaurant:[], activity:[], markers:[]},
    $(this).before("<button class=\"btn btn-circle day-btn\">"+(dayCount++)+"</button>");
  })

  //delete day:
  $('#delete-day').on("click", function(event){
    if (dayCount < 2) return;

    var start = currentDayNum;
    while (allItineraries.hasOwnProperty(start)) {
      allItineraries[start] = allItineraries[parseInt(start)+1];
      start++;
    }

    // resetMarkers();
    // hideItinerary();

    $('#day-add').prev().remove();
    dayCount--;
    var next = $(".current-day");
    if (!next) {
      next = $('#day-add').prev();
    }
    changeDay(next);
  });
