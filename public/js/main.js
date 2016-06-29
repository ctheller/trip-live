var currentMap;
var markers = [];

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
  markers.push({name: name, marker: marker});
  marker.setMap(currentMap);
}  

function removeMarker (name) {
  markers.forEach(function(elem){
    if (elem.name === name){ 
      elem.marker.setMap(null);
    }
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
    whereToAdd.append("<div class=\"itinerary-item\"><span class=\"title\">"+text+"</span><button class=\"btn btn-xs btn-danger remove btn-circle\">x</button></div>")
    
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
    console.log(text);
    removeMarker(text);
    $(this).parent().remove();
  })
