// set map object variable
var myMap = L.map("map", {
    center: [37,-95],
    zoom: 5,
  });
  
    // Add a tile layer
    L.tileLayer("https://api.mapbox.com/v4/mapbox.outdoors/{z}/{x}/{y}.png?" +
    "access_token=pk.eyJ1IjoidmFyc2hhcmFtYWNoIiwiYSI6ImNqbnhyeGJsejAzaXgza28wcjRhNHNjMm0ifQ.H9CPMe-YN9zMVYFJIdB4aA").addTo(myMap);
   
// set up queryURL and grab the geojson data from usgs.gov

  var queryUrl = new XMLHttpRequest(); 
  queryUrl.open("GET",'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson',false);
  queryUrl.send(null);
  queryUrl.responseText
  
  var json_obj = JSON.parse(queryUrl.responseText);
  
  // function for markersize
  function markerSize(num) {
    return num;
  }
  // set the color array for magnitudes
   var colors = ['blue','green','yellow','orange','red','magenta']
  
  // Loop through the geojson data and create markers for the earth quakes, 
  // bind a popup containing magnitude, depth, time and color code based on magnitude
  for (var i = 0; i < json_obj.features.length; i++) {
    var feature = json_obj.features[i];
    var loc = feature.geometry.coordinates;
    var magnitude = feature.properties.mag;
    var depth = feature.geometry.coordinates[2];
    if (magnitude < 1){
      col = colors[0]
    } else if (magnitude >= 1 && magnitude < 2){
      col = colors[1]
    } else if (magnitude >= 2 && magnitude < 3){
      col = colors[2]
    } else if (magnitude >= 3 && magnitude < 4){
      col = colors[3]
    } else if (magnitude >= 4 && magnitude < 5){
      col = colors[4]
    } else {
      col = colors[5]
    }
    L.circleMarker([loc[1], loc[0]], {
      fillOpacity: .6,
      color: "black",
      fillColor: col,
      weight: 1,
      radius: markerSize(magnitude)
    }).bindPopup("<h3>Magnitude : " + magnitude + "</h3>"+"<strong>Depth: </strong>" + depth + ' kilometers'+
        '<br>'+new Date(feature.properties.time) )
      .addTo(myMap);
  }
  
  // set up the legend in the lower right of the map
  var legend = L.control({position: 'bottomleft'});
  
  legend.onAdd = function (myMap) {
  
      var div = L.DomUtil.create('div', 'info legend'),
        
          grades = [0,1,2,3,4,5];
          div.innerHTML = '<h3>Quake Magnitude</h3>'
      // loop through our intervals and generate a label with a colored square for each interval
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i class="legend" style="background:' + colors[i] + '; color:' + colors[i] + ';">....</i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '++');
    }
    return div;
  };
  
  legend.addTo(myMap);