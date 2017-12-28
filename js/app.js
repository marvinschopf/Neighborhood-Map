'use strict';

function mapsError() {
	alert("An error occured while loading the Map.");
}

var defaultLocations = [
	{
		name:"Main-Taunus-Zentrum",
		lat: 000,
		long: 000
	},
	{
		name: "Frankfurt",
		lat: 000,
		long: 000
	}

];



var Location = function(data) {
	var self = this;

	this.name = data.name;
	this.lat = data.lat;
	this.long = data.long;

	this.isVisible = ko.observable(true);

	this.windowContent = '<div class="infwindowcon"><span class="tit"><b>'+data.name+'</b></span></div>';
	this.infoWindow = new google.maps.InfoWindow({content: self.windowContent});
	this.marker = new google.maps.Marker({
			position: new google.maps.LatLng(data.lat, data.long),
			map: map,
			title: data.name
	});
	this.toggleMarker = ko.computed(function() {
		if(this.visible() === true) {
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
		this.locations.push(e);
	});
	map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: {lat: 000, lng: 000}
	});
}

function startBootstrap() {
	ko.applyBindings(new AppViewModel()),
}
