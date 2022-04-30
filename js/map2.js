'use strict';

(function() {
    mapboxgl.accessToken =
        'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';
    let map = new mapboxgl.Map({
        container: 'map', // container ID
        style: 'mapbox://styles/mapbox/dark-v10', // style URL
        center: [-97, 41], // starting position [lng, lat]
        zoom: 3.6, // starting zoom
        projection: 'albers'
    });

    map.on('load', () => {
        map.addSource('cases', {
            type: 'geojson',
            data: 'assets/us-covid-2020-counts.json'
        });

        map.addLayer({
            'id': 'cases-layer',
            'type': 'circle',
            'source': 'cases',
            'paint': {
                // increase the radius of the circle as the zoom level and value increases
                'circle-radius': {
                    'property': 'cases',
                    'stops': [
                        [{
                            zoom: 5,
                            value: cases[0]
                        }, radii[0]],
                        [{
                            zoom: 5,
                            value: cases[1]
                        }, radii[1]],
                        [{
                            zoom: 5,
                            value: cases[2]
                        }, radii[2]],
                        [{
                            zoom: 5,
                            value: cases[3]
                        }, radii[3]],
                    ]
                },
                'circle-color': {
                    'property': 'cases',
                    'stops': [
                        [cases[0], colors[0]],
                        [cases[1], colors[1]],
                        [cases[2], colors[2]],
                        [cases[3], colors[3]]
                    ]
                },
                'circle-stroke-color': 'white',
                'circle-stroke-width': 1,
                'circle-opacity': 0.6
            }
        });

    });

    const cases = [1000, 5000, 10000, 15000], 
    colors = ['green', 'yellow', 'orange', 'red'], 
    radii = [5, 15, 20, 25];

    // click on point to view cases in a popup
    map.on('click', 'cases-layer', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong>County:</strong> ${event.features[0].properties.county}<br><strong>State:</strong> ${event.features[0].properties.state}<br><strong>Cases:</strong> ${event.features[0].properties.cases}<br><strong>Deaths:</strong> ${event.features[0].properties.deaths}`)
            .addTo(map);
    });

    // create legend object, it will anchor to the div element with the id legend.
    const legend = document.getElementById('legend');

    //set up legend cases and labels
    var labels = ['<strong>Amount</strong>'], vbreak;
    //iterate through cases and create a scaled circle and label for each
    for (var i = 0; i < cases.length; i++) {
        vbreak = cases[i];
        // you need to manually adjust the radius of each dot on the legend 
        // in order to make sure the legend can be properly referred to the dot on the map.
        var dot_radius = 2 * radii[i];
        labels.push(
            '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radius +
            'px; height: ' +
            dot_radius + 'px; "></i> <span class="dot-label" style="top: ' + dot_radius / 2 + 'px;">' + vbreak +
            '</span></p>');

    }

    const source =
        '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">The New York Times</a>, <a href="https://data.census.gov/cedsci/table?g=0100000US.050000&d=ACS%205-Year%20Estimates%20Data%20Profiles&tid=ACSDP5Y2018.DP05&hidePreview=true">ACS</a>, & <a href="https://www.census.gov/geographies/mapping-files/time-series/geo/carto-boundary-file.html">U.S. Census Bureau</a></p>';

    // combine all the html codes.
    legend.innerHTML = labels.join('') + source;
})();