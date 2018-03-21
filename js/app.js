//declare global vars
var map;
var infowindow;
var markers = [];


function ViewModel() {
	
	//implementation of the map
function initMap() {
	var self = this;
	// Create the map centered in desired location and zoom
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:41.908803, lng:-87.679598},
		zoom: 15,
		//styles: styles,
		mapTypeControl: false
	});

	infowindow = new google.maps.InfoWindow();

	for (var i = 0; i <= locations.length; i++) {
	//setting the position and title based on location.js file	
		this.position = locations[i].location;
		this.title = locations[i].title;
	//creating marker	
		this.marker = new google.maps.Marker({
		map: map,
		position: this.position,
		title: this.title,
		animation: google.maps.Animation.DROP,
		});
	//push marker to array
		this.markers.push(this.marker);
	//create onClick even to open infoWindow for each marker
		this.marker.addListener('click', function() {
		populateIW(this, infowindow);
	});	
	} 
  };
initMap();

function mapError() {
  		alert("Google Maps is dead, Jim!");
  	}

  	//this is what goes on the infoWindow upon clicking on the marker
  	//or location name on sidebar
function popuateIW(marker, infowindow) {
		if (infowindow.marker != marker) {
			infowindow.marker = marker;
			infowindow.setContent('');

	//4square API data
	var	clientId = "NMHLYWGLLNXPUVP1AA4GTGVCWL51AVULQYXW5RSSCJJ5CHZQ";
	var	clientSecret = "L2WDZZINOWDJVIAYWTE2YIM1SB1VINNTWZP3EIM4SIAWPOOF";

	//4square URL
	var	foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' 
		+ this.location.lat + ','
		+ this.location.lng + ','
		+ '&client_id=' + clientId
		+ '&client_secret=' + clientSecret
		+ '&v=20170801' + '&query=' + marker.title;
		
	//4square API	
	$.getJSON(foursquareURL).done(function(marker) {	
			infowindow.open(map, marker);
	//makes sure marker property is cleared when infowindow is closed
			infowindow.addListener('closeclick', function() {
			infowindow.marker = null;	
			});		
		}).fail(function() {
			alert("Foursquare is dead, Jim!");
		});

	}

  this.searchedLocation = ko.observable('');
  this.searchList = ko.computed(function() {
  	var match = [];
  	for (var i = 0; i <= this.markers.length; i++) {
  		var locationsList = this.markers[i];
  		if (locationsList.title.toLowerCase().includes(this.searchedLocation().toLowerCase())) {
  			match.push(locationsList);
  			this.markers[i].setVisible(true);
  		} else {
  			this.markers[i].setVisible(false);
  		}
  	}
  	return match;
  }, this);
};
}

function runMyApp() {
    ko.applyBindings(new ViewModel());
}




