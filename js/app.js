'use strict';

// Define a error handler for the map
function mapsError() {
	alert("An error occured while loading the Map. Please reload the page and try again/open a issue at https://github.com/MagicMarvMan/Neighborhood-Map/issues.");
}

// The defaultQuery for the search field
var defaultQuery = "";

var config = {
	locations: [
		{
			name: 'Roemerberg',
			lat: 50.110421,
			long: 8.68214
		},

		{
			name: 'Main-Tower',
			lat: 50.112557,
			long: 8.672145
		},

		{
			name: 'Goethe-House and Museum',
			lat: 50.111276,
			long: 8.677586
		},

		{
			name: 'Main-Station',
			lat: 50.107726,
			long: 8.664607
		},

		{
			name: 'Senckenberg Natural History Museum',
			lat: 50.117574,
			long: 8.651723
		},

		{
			name: 'The Frankfurt Museum of Modern Art',
			lat: 50.112022,
			long: 8.684780
		},

		{
			name: 'The Old Opera House',
			lat: 50.116046,
			long: 8.671895
		},

		{
			name: 'Zoo Frankfurt',
			lat: 50.116368,
			long: 8.699447
		},

		{
			name: 'St. Paul\'s Church',
			lat: 50.111228,
			long: 8.680736
		},

		{
			name: 'Palm Garden',
			lat: 50.123133,
			long: 8.656486
		}

	],
	map: {
		lat: 50.111221,
		long: 8.682562,
		zoom: 14
	},

	keys: {
		google: {
			// Place your key in the <script> tag in the index.html footer
		},

		foursquare: {
			client_id: "[YOUR CLIENTID HERE]",
			client_secret: "[YOUR CLIENTSECRET HERE]"
		}
	}
}


// Create global variables
var map;
var allInfowindows = ko.observableArray([]);
var foursquareContinue = true;

var Location = function(data) {
	var self = this;

	// Initialize local variables
	this.name = data.name;
	this.lat = Number(data.lat);
	this.long = Number(data.long);
	this.phone = "Unknown";
	this.url = "#Unknown";
	this.hereNow = "Nobody here";

	// Only execute AJAX if we should continue with it
	if(foursquareContinue) {
		$.getJSON("https://api.foursquare.com/v2/venues/search?client_id="+config.keys.foursquare.client_id+"&client_secret="+config.keys.foursquare.client_secret+"&v=20171228&ll="+self.lat+","+self.long+"&query="+self.name, function(data) {
		// Log the current name for better readability
		console.log(self.name+":");

		// Check if a answer came back
		if(data.response.venues.length > 0) {
			// Log data
			console.log(data);
			console.log(data.response);
			console.log(data.response.venues[0]);

			// Check if url exists in the response
			if (typeof data.response.venues[0].url !== 'undefined') {
  				self.url = data.response.venues[0].url;
			}

			// Check if formattedPhone-Number exists in the response
			if(typeof data.response.venues[0].contact.formattedPhone !== 'undefined') {
				self.phone = data.response.venues[0].contact.formattedPhone;
			}

			// Check if the hereNow summary exists in the response
			if(typeof data.response.venues[0].hereNow.summary !== 'undefined') {
				self.hereNow = data.response.venues[0].hereNow.summary;
			}
		}
		
	// Set a error handler onFail	
	}).fail(function() {
		// Cancel following calls
		foursquareContinue = false;
		alert("The Foursquare Requests failed. Try again or open a issue at GitHub.");
	});
	}


	// Log some information (useful for debugging)
	console.log("Initialized "+this.name);
	console.log("Lat: "+this.lat);
	console.log("Long: "+this.long);

	// Create an observable for the isVisible valeu
	this.isVisible = ko.observable(true);

	// Set the content of the InfoWindow
	this.contentString = '<div class="infwindowcon"><span class="tit"><b>'+data.name+'</b></span><center><br><span style="font-weight:bold;">Homepage:&nbsp;</span><a href="'+self.url+'" target="_blank">'+self.url+'</a><br><span style="font-weight:bold;">Phone:&nbsp;</span>'+self.phone+'<br><span style="font-weight:bold;">Here now:&nbsp;</span>'+self.hereNow+'</center></div>';
	
	// Create an local instance of the InfoWindow
	this.infoWindow = new google.maps.InfoWindow({content: self.windowContent});

	// Push our InfoWindow to allInfowindows array
	allInfowindows().push(self.infoWindow);

	// Create a marker on the map
	this.marker = new google.maps.Marker({
			position: {lat:Number(self.lat),lng:Number(self.long)},
			map: map,
			title: self.name
	});

	// Toggle the marker
	this.toggleMarker = ko.computed(function() {
		// Detect if the marker IS visible or NOT
		if(this.isVisible() === true) {
			this.marker.setMap(map);
		} else {
			this.marker.setMap(null);
		}
		return true;
	}, this);

	// Add click listener to the marker
	this.marker.addListener('click', function(){

		// Close all other InfoWindows
		allInfowindows().forEach(function(e) {
			e.close();
		});

		// Reset the contentString (to squash a local bug)
		self.contentString = '<div class="infwindowcon"><span class="tit"><b>'+data.name+'</b></span><center><br><span style="font-weight:bold;">Homepage:&nbsp;</span><a href="'+self.url+'" target="_blank">'+self.url+'</a><br><span style="font-weight:bold;">Phone:&nbsp;</span>'+self.phone+'<br><span style="font-weight:bold;">Here now:&nbsp;</span>'+self.hereNow+'</center></div>';
		// Set the InfoWindows content to our created contentString
		self.infoWindow.setContent(self.contentString);
		// Open this one InfoWindow
		self.infoWindow.open(map, this);
		// Execute bounce animation
		self.marker.setAnimation(google.maps.Animation.BOUNCE);

		// Stop animation after 2100ms
      	setTimeout(function() {
      		self.marker.setAnimation(null);
     	}, 2100);
	});

	// Function to bounce the marker, used in the result list
	this.bounceMarker = function(place) {
		// Dont rewrite the animation code, trigger a click event on the marker
		google.maps.event.trigger(self.marker, 'click');
	};

	// Toggle the marker (to squash a bug)
	this.toggleMarker();
}


function AppViewModel() {
	var self = this;

	// Initialize the map
	map = new google.maps.Map(document.getElementById('map'), {
			zoom: config.map.zoom,
			// Set the center to the values in the configuration
			center: {lat: config.map.lat, lng: config.map.long}
	});

	// Get a query, set it's default to the defaultQuery
	this.query = ko.observable(defaultQuery);
	// Create a local observableArray containing all locations
	this.locations = ko.observableArray([]);

	// Iterate over all locations hard coded in the config
	config.locations.forEach(function(e) {
		console.log(e.name);
		// Add them to our observableArray
		self.locations.push(new Location(e));
	});

	// this.list is our list of searched results
	this.list = ko.computed(function() {
		// Set the search query to our observable query, cast it to lower case
		var searchQuery = self.query().toLowerCase();

		// Check if the search query exists/is not empty
		if(!searchQuery) {
			// Iterate over our observableArray
			self.locations().forEach(function(e) {
				// Set visible for every marker to true
				e.isVisible(true);
			});
			// Return all locations
			return self.locations();
		} else {
			// Apply a arrayFilter to our location list
			return ko.utils.arrayFilter(self.locations(),function(e) {
				// Get the unedited title in lower case
				var uneditedTitle = e.name.toLowerCase();
				// Check if it SHOULD be visible
				var computedVisibility = (uneditedTitle.search(searchQuery) >= 0);
				// Set the visibility to our computed visibility
				e.isVisible(computedVisibility);
				// Return if it is visible in this loop
				return computedVisibility;
			});
		}
	},self);
}


// Start the AppViewModel
function startBootstrap() {
	ko.applyBindings(new AppViewModel());
}
