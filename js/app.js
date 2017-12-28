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
