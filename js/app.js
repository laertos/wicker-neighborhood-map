//declare global vars
var map;

function runApp() {

	var markers = [];

	function initMap() {
		// Create the map centered in desired location and zoom
		map = new google.maps.Map(document.getElementById('map'), {
			center: {lat:41.908803, lng:-87.679598},
			zoom: 15,
			//styles: styles,
			mapTypeControl: false
		});

		infowindow = new google.maps.InfoWindow();

		for (var i = 0; i < locations.length ; i++) {

			//setting the position and title based on location.js file	
			position = locations[i].location;
			title = locations[i].title;

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
	}

	initMap();

	 
	function mapError() {
	  		alert("Google Maps is dead, Jim!");
	}

	//this is what goes on the infoWindow upon clicking on the marker or location name on sidebar
	function populateIW(marker, infowindow) {
			
		if (infowindow.marker != marker) {
			infowindow.marker = marker;
			infowindow.setContent('');
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
			+ '&v=20170801' 
			+ '&query=' + marker.title;

			//4square API	
			$.getJSON(foursquareURL).done(function(marker) {
			
				var data = marker.response.venues[0];
				var name = data.name;
				var street = data.location.formattedAddress[0];
				var city = data.location.formattedAddress[1];
				var state = data.location.formattedAddress[2];
				var phone = data.contact.formattedPhone ? data.contact.formattedPhone : "Phone Number not found";
				var website = data.url ? data.url : "Website not found";

				var IWcontent = 
					'<div>' + 
					'<h4 class="IWtext">' + name + '</h4>' +
					'<p class="IWtext">' + street + '</p>' +
					//'<p class="IWtext">' + city + '</p>' +
					//'<p class="IWtext">' + state + '</p>' +
					'<p class="IWtext">' + phone + '</p>' +
					'<p class="IWtext">' + website + '</p>' + 
					'</div>';

			infowindow.setContent(IWcontent);
			
			}).fail(function() {
				alert("Foursquare is dead, Jim!");
			});

			infowindow.open(map, marker);
			//makes sure marker property is cleared when infowindow is closed
			infowindow.addListener('closeclick', function() {
			infowindow.marker = null;
				});
		}
	}

	var Location = function(data) {
		this.title = ko.observable(data.title);
		this.lat = ko.observable(data.location.lat);
  		this.lng = ko.observable(data.location.lng);
	}

	var viewModel = function() {
		var self= this;
			self.displayList = ko.observableArray([]);
			self.searchedLocation = ko.observable('');

			locations.forEach(function(item) {
				self.displayList.push(new Location(item));	
			});
			self.currentLocation = ko.observable(self.displayList()[0]);
			self.filtered = ko.computed(function() {
				if (!self.searchedLocation()) {
					return self.displayList();
				} else {
					return self.displayList().filter(location => location.title().toLowerCase().indexOf(
						self.searchedLocation().toLowerCase()) > -1);
				}
			});
	}
	ko.applyBindings(new viewModel());

};






