//declare global vars
var map;
var infowindow;
var markers = [];
var clientId;
var clientSecret;

function ViewModel() {
	//var self = this;
	//implementation of the map
function initMap() {
	//var self = this;
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
		var position = locations[i].location;
		var title = locations[i].title;
	//creating marker	
		var marker = new google.maps.Marker({
		map: map,
		position: position,
		title: title,
		animation: google.maps.Animation.DROP,
		});
	//push marker to array
		markers.push(marker);
	//create onClick even to open infoWindow for each marker
		marker.addListener('click', function() {
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
function populateIW(marker, infowindow) {
	var self = this;	
	if (infowindow.marker != marker) {
		infowindow.marker = marker;
		//infowindow.setContent(self.IWcontent);

	//4square API data
	clientId = "NMHLYWGLLNXPUVP1AA4GTGVCWL51AVULQYXW5RSSCJJ5CHZQ";
	clientSecret = "L2WDZZINOWDJVIAYWTE2YIM1SB1VINNTWZP3EIM4SIAWPOOF";

	//4square URL
	var	foursquareURL = 'https://api.foursquare.com/v2/venues/search?ll=' 
		+ 41.908803 + ','
		+ -87.679598 + ','
		+ '&client_id=' + clientId
		+ '&client_secret=' + clientSecret
		+ '&v=20170801' + '&query=' + this.title;

	//4square API	
	$.getJSON(foursquareURL).done(function(marker) {
		
		var data = marker.response.venues[0];
		self.name = data.name;
		self.street = data.location.formattedAddress[0];
		self.city = data.location.formattedAddress[1];
		self.state = data.location.formattedAddress[2];
		self.phone = data.contact.formattedPhone ? data.contact.formattedPhone : "Phone Number not found";
		self.website = data.url ? data.url : "Website not found";

		self.IWcontent = 
		'<div>' + 
		'<h6 class="IWtext">' + this.title + '</h6>';
		'<p class="IWtext">' + self.street + '</p>';
		'<p class="IWtext">' + self.city + '</p>';
		'<p class="IWtext">' + self.state + '</p>';
		'<p class="IWtext">' + self.phone + '</p>';
		'<p class="IWtext">' + self.website + '</p>'; 
		+ '</div>'; 
		infowindow.setContent(self.IWcontent);
		
		}).fail(function() {
			alert("Foursquare is dead, Jim!");
		});

		infowindow.open(map, marker);
	//makes sure marker property is cleared when infowindow is closed
		infowindow.addListener('closeclick', function() {
		infowindow.marker = null;	
			});
	}
};	

 
var searchList = ko.computed(function() {
  	//var self = this;
  	var searchedLocation = ko.observable('');
  	var match = [];
  	for (var i = 0; i <= markers.length; i++) {
  		var locationsList = markers[i];
  		if (locationsList.title.toLowerCase().includes(searchedLocation().toLowerCase())) {
  			match.push(locationsList);
  			match.style.visibility = 'visible';
  		} else {
  			match.style.visibility = 'hidden';
  		}
  	}
  	return match;
  }, this);

};

function runMyApp() {
    ko.applyBindings(new ViewModel());
}



