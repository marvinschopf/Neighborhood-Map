'use strict';

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
	map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: {lat: 000, lng: 000}
	});
}
