'use strict';

function mapsError() {
	alert("An error occured while loading the Map.");
}

var defaultLocations = [
	{
		name:"Main-Taunus-Zentrum",
		lat: 50.1436,
		long: 8.4483
	},
	{
		name: "Frankfurt",
		lat: 50.1436,
		long: 8.4483
	}

];


var map;

var Location = function(data) {
	var self = this;

	this.name = data.name;
	this.lat = data.lat;
	this.long = data.long;

	console.log("Initialized "+this.name);

	this.isVisible = ko.observable(true);

	this.windowContent = '<div class="infwindowcon"><span class="tit"><b>'+data.name+'</b></span></div>';
	this.infoWindow = new google.maps.InfoWindow({content: self.windowContent});
	this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(data.lat, data.long),
			map: map,
			title: data.name
	});
	this.toggleMarker = ko.computed(function() {
		if(this.isVisible() === true) {
			this.marker.setMap(map);
		} else {
			this.marker.setMap(null);
		}
		return true;
	}, this);
}


function AppViewModel() {
	var self = this;

	this.locations = ko.observableArray([]);
	defaultLocations.forEach(function(e) {
		console.log(e.name);
		self.locations.push(new Location(e));
	});
	map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: {lat: 50.1436, lng: 8.4483}
	});

	this.mapElem = document.getElementById('map');
	this.mapElem.style.height = window.innerHeight - 50;
}

function startBootstrap() {
	ko.applyBindings(new AppViewModel());
}
