var map;
var markerLayer = L.layerGroup();
var drawnItems = new L.FeatureGroup();
var userMarker; // Marker for user's current position
var userPath = []; // Array to store user's path coordinates
var pathLine; // Polyline for user's path

document.addEventListener('DOMContentLoaded', function() {
    map = L.map('map').setView([51.505, -0.09], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    markerLayer.addTo(map);
    drawnItems.addTo(map);

    var drawControl = new L.Control.Draw({
        edit: {
            featureGroup: drawnItems,
            edit: false
        },
        draw: {
            polygon: true,
            polyline: false,
            rectangle: false,
            circle: false,
            marker: false
        }
    });
    map.addControl(drawControl);

    map.on('draw:created', function (e) {
        var type = e.layerType,
            layer = e.layer;
        if (type === 'polygon') {
            drawnItems.addLayer(layer);
        }
    });

    // Continuously watch the user's location
    map.locate({watch: true, setView: true, maxZoom: 16});
    map.on('locationfound', onLocationFound);

    map.on('click', function(e) {
        document.getElementById('latitude').value = e.latlng.lat.toFixed(5);
        document.getElementById('longitude').value = e.latlng.lng.toFixed(5);
    });
});

function onLocationFound(e) {
    var latlng = e.latlng;

    if (!userMarker) {
        userMarker = L.marker(latlng, {icon: glowingIcon}).addTo(map);
        userPath.push(latlng);
        pathLine = L.polyline(userPath, {color: 'blue'}).addTo(map);
    } else {
        userMarker.setLatLng(latlng);
        userPath.push(latlng); // Store the new point in the path
        pathLine.addLatLng(latlng); // Add new point to the path line
    }
}

var glowingIcon = L.divIcon({
    className: 'glowing-marker',
    html: '<span class="icon"></span>',
    iconSize: [30, 30],
    iconAnchor: [15, 15]
});

function downloadPathAsGeoJSON() {
    if (pathLine) {
        var geoJsonData = pathLine.toGeoJSON();
        var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(geoJsonData));
        var dlAnchorElem = document.createElement('a');
        dlAnchorElem.setAttribute("href", dataStr);
        dlAnchorElem.setAttribute("download", "path.geojson");
        dlAnchorElem.click();
    } else {
        alert("No path to download");
    }
}

function addWaypoint() {
    // Existing addWaypoint function
}

function downloadWaypoints() {
    // Existing downloadWaypoints function
}

function downloadJSON(data, filename) {
    // Existing downloadJSON function
}

function enableLocation() {
    if ("geolocation" in navigator) {
        // Geolocation available
        navigator.geolocation.getCurrentPosition(function(position) {
            alert("Location enabled. Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
            // You can also start tracking position continuously with watchPosition() here
        }, function(error) {
            alert("Error obtaining location: " + error.message);
        }, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        // Geolocation is not supported
        alert("Geolocation is not supported by your browser.");
    }
}

function startCamera() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: false })
        .then(function(stream) {
            var video = document.getElementById('video');
            video.srcObject = stream;
            video.play();
        })
        .catch(function(err) {
            console.log("An error occurred: " + err);
        });
}

function captureImage() {
    var canvas = document.getElementById('canvas');
    var video = document.getElementById('video');
    var photo = document.getElementById('photo');
    
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
    var imageDataUrl = canvas.toDataURL('image/png');
    
    photo.setAttribute('src', imageDataUrl);
    photo.style.display = 'block';
    // Optional: You can now save the image data or send it to a server
}
