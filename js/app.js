//declare global vars
var map;

function ViewModel() {
	var self = this;
	this.markers = [];
	//implementation of the map
	this.initMap = function() {
	// Create the map centered in desired location and zoom
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:41.908803, lng:-87.679598},
		zoom: 15,
		//styles: styles,
		mapTypeControl: false
	});

	this.infowindow = new google.maps.InfoWindow();
	//create markers on initialize using locations.js
	for (var i = 0; i <= locations.length; i++) {
		this.position = locations[i].location;
		this.title = locations[i].title;
		this.marker = new google.maps.Marker({
		map: map,
		position: this.position,
		title: this.title,
		animation: google.maps.Animation.DROP,
		id: i
		});
	//push marker to array
	
	this.markers.push(this.marker);
	//create onClick even to open infoWindow for each marker
	this.marker.addListener('click', function() {
		populateInfoWindow(this, infowindow);
	});	
	} 
  };
  this.initMap();

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


function runMyApp() {
    ko.applyBindings(new ViewModel());
}



