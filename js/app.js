$("#toggle").click(function() {
  $(this).toggleClass("on");
  $("#locations").slideToggle();
});

var map;

function ViewModel () {
	var self = this;

	this.markers = [];

	this.initMap = function() {

	// Create the map centered in desired location and zoom
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat:41.908803, lng:-87.679598},
		zoom: 15,
		//styles: styles,
		mapTypeControl: false
	});

	this.largeInfowindow = new google.maps.InfoWindow();
	//create markers on initialize using locations.js
	for (var i = 0; i <= locations.length; i++) {
		this.position = locations[i].location;
		this.name = locations[i].name;
		this.marker = new google.maps.Marker({
		map: map,
		position: this.position,
		name: this.name,
		animation: google.maps.Animation.DROP,
		id: i
		});
	//push marker to array
	
	this.markers.push(this.marker);
	//create onClick even to open infoWindow for each marker
	this.marker.addListener('click', function() {
		populateInfoWindow(this, largeInfowindow);
	});	
	} 
  };
  this.initMap();
};
ViewModel();



