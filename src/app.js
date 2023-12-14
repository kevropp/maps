/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Loader } from '@googlemaps/js-api-loader';
import MarkerClusterer from '@google/markerclustererplus';

const apiOptions = {
  apiKey: 'AIzaSyDOKvvM9afHhJIqkkH_sayrczcWq83cg4w'
}

const loader = new Loader(apiOptions);

loader.load().then(async () => {
  console.log('Maps JS API loaded');
  const map = displayMap();
  const markers = await addMarkers(map);
  clusterMarkers(map, markers);
  addPanToMarker(map, markers);
});

function displayMap() {
  const darkThemeStyles = [
    { elementType: 'geometry', stylers: [{color: '#242f3e'}] },
    { elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}] },
    { elementType: 'labels.text.fill', stylers: [{color: '#746855'}] },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{color: '#38414e'}]
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{color: '#212a37'}]
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{color: '#9ca5b3'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{color: '#746855'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{color: '#1f2835'}]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{color: '#f3d19c'}]
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{color: '#2f3948'}]
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{color: '#d59563'}]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{color: '#17263c'}]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{color: '#515c6d'}]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{color: '#17263c'}]
    }
  ];

  const mapOptions = {
    center: { lat: 40.343182, lng: -105.688103 },
    zoom: 11,
    mapTypeId: 'terrain',
    styles: darkThemeStyles // Apply the dark theme styles here
  };
  const mapDiv = document.getElementById('map');
  return new google.maps.Map(mapDiv, mapOptions);
}


async function addMarkers(map) {
  try {
    const response = await fetch('https://services1.arcgis.com/fBc8EJBxQRMcHlei/arcgis/rest/services/ROMO_GEOL_Summits_pt_NAD83_1/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson'); // Replace with your REST service URL
    const data = await response.json();

    const markers = [];
    data.features.forEach(feature => {
      const longitude = feature.geometry.coordinates[0];
      const latitude = feature.geometry.coordinates[1];

      const markerOptions = {
        map: map,
        position: { lat: latitude, lng: longitude },
        icon: {
          url: './img/custom_pin.png', // URL of the custom icon
          scaledSize: new google.maps.Size(30, 30) // Resize icon (width, height in pixels)
        }
      };
      const marker = new google.maps.Marker(markerOptions);
      markers.push(marker);
    });
    return markers;
  } catch (error) {
    console.error('Error fetching data:', error);
    return []; // Return an empty array in case of error
  }
}

function clusterMarkers(map, markers) {
  const clustererOptions = { imagePath: './img/m' };
  const markerCluster = new MarkerClusterer(map, markers, clustererOptions);
}

function addPanToMarker(map, markers) {
  let circle;
  markers.map(marker => {
    marker.addListener('click', event => {
      const location = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      map.panTo(location);
      if (circle) {
        circle.setMap(null);
      }
      circle = drawCircle(map, location);
    });
  });
}

function drawCircle(map, location) {
  const circleOptions = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 1,
    map: map,
    center: location,
    radius: 800
  }
  const circle = new google.maps.Circle(circleOptions);
  return circle;
}
