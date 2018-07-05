//declare global vars
var appViewModel;
var map;
//create array to list markers in map
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
 	defaultIcon = makeMarkerIcon('00113D');
	highlightedIcon = makeMarkerIcon('FFFF00');

	for (var j = 0; j < locations.length; j++) {

		//setting the position and title based on location.js file	
		position = locations[j].location;
		title = locations[j].title;

		//creating marker	
		marker = new google.maps.Marker({
		map: map,
		position: position,
		title: title,
		animation: google.maps.Animation.DROP,
		icon: defaultIcon
		});

		//push marker to array
		markers.push(marker);

		appViewModel.displayList()[j].marker = marker;
		//create onClick even to open infoWindow for each marker
		marker.addListener('click', function() {
			populateIW(this, infowindow);
		});
		marker.addListener('mouseover', function() {
        this.setIcon(highlightedIcon);
      });
      	marker.addListener('mouseout', function() {
        this.setIcon(defaultIcon);
      });	
	}

	
	function makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
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
}

function mapError() {
	  	alert("Google Maps is dead, Jim!");
}

	
//Place contructor
var Place = function(data) {
	var self = this;
	this.title = data.title;
	this.lat = data.location.lat;
	this.lng = data.location.lng;
	this.show = ko.observable(true);
};

var viewModel = function() {
	var self = this;

	this.displayList = ko.observableArray();
	this.searchedLocation = ko.observable('');

	for (i = 0; i < locations.length; i++) {
		var myPlace = new Place(locations[i]);
		self.displayList.push(myPlace);
	}
	
	this.filtered = ko.computed(function() {
		var filter = self.searchedLocation().toLowerCase(); //listens to what is being typed

			for (j = 0; j < self.displayList().length; j++) {
				if (self.displayList()[j].title.toLowerCase().indexOf(filter) > -1) {
					self.displayList()[j].show(true);
					if (self.displayList()[j].marker) {
						self.displayList()[j].marker.setVisible(true);
					}
				} else {
					self.displayList()[j].show(false);
					if (self.displayList()[j].marker) {
						self.displayList()[j].marker.setVisible(false);
					}	
				}
			}		
	});

	this.showLocation = function(locations) {
		google.maps.event.trigger(locations.marker, "click");
		};
};
appViewModel = new viewModel();

ko.applyBindings(appViewModel);










