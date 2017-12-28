'use strict';

function mapsError() {
	alert("An error occured while loading the Map.");
}

var defaultQuery = "";

var defaultLocations = [
	{
		name:"Main-Taunus-Zentrum",
		lat: "50.1436",
		long: "8.4483"
	},
	{
		name: "Frankfurt",
		lat: "50.1436",
		long: "9.4483"
	}

];


var map;

var Location = function(data) {
	var self = this;

	this.name = data.name;
	this.lat = Number(data.lat);
	this.long = Number(data.long);

	console.log("Initialized "+this.name);
	console.log("Lat: "+this.lat);
	console.log("Long: "+this.long);

	this.isVisible = ko.observable(true);

	this.windowContent = '<div class="infwindowcon"><span class="tit"><b>'+data.name+'</b></span></div>';
	this.infoWindow = new google.maps.InfoWindow({content: self.windowContent});
	this.marker = new google.maps.Marker({
			position: {lat:Number(self.lat),lng:Number(self.long)},
			map: map,
			title: self.name
	});
	this.toggleMarker = ko.computed(function() {
		if(this.isVisible() === true) {
			this.marker.setMap(map);
		} else {
			this.marker.setMap(null);
		}
		return true;
	}, this);

	this.marker.addListener('click', function(){
		self.contentString = '<div class="infwindowcon"><span class="tit"><b>'+data.name+'</b></span></div>';

        self.infoWindow.setContent(self.contentString);

		self.infoWindow.open(map, this);

		self.marker.setAnimation(google.maps.Animation.BOUNCE);
      	setTimeout(function() {
      		self.marker.setAnimation(null);
     	}, 2100);
	});

	this.bounce = function(place) {
		google.maps.event.trigger(self.marker, 'click');
	};

	this.toggleMarker();
}


function AppViewModel() {
	var self = this;

	map = new google.maps.Map(document.getElementById('map'), {
			zoom: 12,
			center: {lat: 50.1436, lng: 8.4483}
	});

	this.query = ko.observable(defaultQuery);
	this.locations = ko.observableArray([]);
	defaultLocations.forEach(function(e) {
		console.log(e.name);
		self.locations.push(new Location(e));
	});
	this.list = ko.computed(function() {
		var searchQuery = self.query().toLowerCase();
		if(!searchQuery) {
			self.locations().forEach(function(e) {
				e.isVisible(true);
			});
			return self.locations();
		} else {
			return ko.utils.arrayFilter(self.locations(),function(e) {
				var uneditedTitle = e.name.toLowerCase();
				var computedVisibility = (uneditedTitle.search(searchQuery) >= 0);
				e.isVisible(computedVisibility);
				return computedVisibility;
			});
		}
	},self);
	

	this.mapElem = document.getElementById('map');
	this.mapElem.style.height = window.innerHeight - 50;
}

function startBootstrap() {
	ko.applyBindings(new AppViewModel());
}
