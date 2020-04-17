url = "https://opendata.arcgis.com/datasets/4a702cd67be24ae7ab8173423a768e1b_0.geojson"



var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});
var myMap = L.map("map", {
  center: [34.052235, -118.243683],
  zoom: 7,
});
// Adding tile layer to the map
lightmap.addTo(myMap);

var gData
var onlineyear
var energy_type
var MWproduction
var stationID
var income
var county
var state



function init() {
  var select = d3.select("#selectNumber");
  d3.json(url, (data) => {
    gData = data
    initBarchart(gData)
    initBubbleChart(gData)
    initPieChart(gData)
    initTimeline(gData)
    var sampleNames = data.features
    var uniqueList= new Set();  
    for (index = 0; index < sampleNames.length; index++) { 
        uniqueList.add(sampleNames[index].properties.General_Fuel)
    } 
     uniqueList.forEach((sample) => {
       select
         .append("option")
        .text(sample)
         .property("value", sample);
     });

    L.geoJson(data, {
      onEachFeature: function (feature, layer) {
        var newMarker = L.marker([feature.properties.Latitude, feature.properties.Longitude]);
        newMarker.addTo(myMap);
        newMarker.bindPopup("Plant Label: " + feature.properties.Plant_Label + "<br>");
      }
    })
    
  }
  )
    
   
}

function newId(sample) {
  var sampleRows = gData.features
  var filterData = sampleRows.filter(d => d.properties.General_Fuel == sample)
  
  onlineyear = filterData.map(d => d.properties.Online_Year == null ? undefined : d.properties.Online_Year)
  energy_type = filterData.map(d => d.properties.General_Fuel)
  MWproduction = filterData.map(d => d.properties.MW)
  stationID = filterData.map(d => d.properties.Plant_ID)
  income = filterData.map(d => d.properties.Net_MWh == null ? undefined : d.properties.Net_MWh)
  county = filterData.map(d => d.properties.County)
  state = filterData.map(d => d.properties.state)


  
  createBarChart(energy_type, MWproduction)
  createBubblechart(onlineyear, MWproduction, energy_type, filterData)
  createTimeline(energy_type, income)
  createPieChart()

}

function createMap(filterData){
      
    
      for (i=0;i<filterData.length;i++){
      var newMarker = L.marker(filterData[i].properties.Latitude, filterData[i].properties.Longitude);
      newMarker.addTo(myMap);
      newMarker.bindPopup("Plant Label: " + filterData[i].properties.Plant_Label + "<br>");
    }
  
}

function createBarChart(energy_type, MWproduction) {
  var trace = {
    x: energy_type,
    y: MWproduction,
    type: "bar"
  };

  var data = [trace];
  var layout = {
    title: "Total Capacity",
    xaxis: { title: "Type of Energy" },
    yaxis: { title: "Total Capacity in MWH" }
  };
  Plotly.newPlot("bar", data, layout);
}

//Added by Diana 4/16/2020 @8:13pm
function createBubblechart(onlineyear, MWproduction, energy_type, filterData) {

  var trace2 = {
    x: onlineyear,
    y: MWproduction,
    mode: "markers",
    marker: {
      size: 15
      // color: energy_type
    }
  };
  var trace2data = [trace2]
  var layout2 = {
    title: "Historical Energy Production",
    margin: { t: 0 },
    hovermode: "closest",
    xaxis: { title: "Online Year" },
    yaxis: { title: "Mega Watt Production" },
    margin: { t: 30 }
  };
  Plotly.newPlot("bubble", trace2data, layout2);
};
// }
//Diana addition - Code finish here

function createTimeline(energy_type, income, MWproduction) {


}
function createPieChart() {

}


function initBarchart(gData) {
  
  var infoData=gData.features
  var energy=[]
  var MW=[]
  for (i=0;i<infoData.length;i++){
    energy.push(infoData[i].properties.General_Fuel)
    MW.push(infoData[i].properties.MW)
  }
  var trace = {
    x: energy,
    y: MW,
    type: "bar",
    transforms: [{
    type: 'groupby',
    groups: energy,
    styles: [
      {target: 'Wind', value: {marker: {color: 'blue'}}},
      {target: 'Gas', value: {marker: {color: 'red'}}},
      {target: 'Hydro', value: {marker: {color: 'black'}}},
      {target: 'Biomass', value: {marker: {color: 'green'}}},
      {target: 'Solar', value: {marker: {color: 'pink'}}},
      {target: 'Landfill Gas', value: {marker: {color: 'purple'}}},
      {target: 'Nuclear', value: {marker: {color: 'yellow'}}},
      {target: 'MSW', value: {marker: {color: 'brown'}}},
      {target: 'Coal', value: {marker: {color: 'limegreen'}}},
      {target: 'Digester Gas', value: {marker: {color: 'lightcoral'}}},
      {target: 'Battery', value: {marker: {color: 'orange'}}},
      {target: 'Solar Thermal', value: {marker: {color: 'salmon'}}},
      {target: 'Geothermal', value: {marker: {color: 'darkblue'}}}
    ]
  }]}

  var data = [trace];
  var layout = {
    title: "Total Capacity",
    xaxis: { title: "Type of Energy" },
    yaxis: { title: "Total Capacity in MWH" }
  };
  Plotly.newPlot("bar", data, layout);
}

function initBubbleChart(gData) {
  var infoData=gData.features
  var years=[]
  var energy=[]
  var MW=[]
  for (i=0;i<infoData.length;i++){
    years.push(infoData[i].properties.Online_Year)
    MW.push(infoData[i].properties.MW)
    energy.push(infoData[i].properties.General_Fuel)
  }
  var trace2 = {
    x: years,
    y: MW,
    mode: "markers",
    marker: {
      size: 15,
     color: energy
    }
  };
  var trace2data = [trace2]
  var layout2 = {
    title: "Historical Energy Production",
    margin: { t: 0 },
    hovermode: "closest",
    xaxis: { title: "Online Year" },
    yaxis: { title: "Mega Watt Production" },
    margin: { t: 30 }
  };
  Plotly.newPlot("bubble", trace2data, layout2);

}
function initTimeline() {

}
function initPieChart() {

}


init()

