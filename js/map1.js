'use strict';

(function() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiamFrb2J6aGFvIiwiYSI6ImNpcms2YWsyMzAwMmtmbG5icTFxZ3ZkdncifQ.P9MBej1xacybKcDN_jehvw';

    const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/dark-v10', // style URL
            zoom: 3.5, // starting zoom
            center: [-98, 43], // starting center
            projection: 'albers'
        }
    );

    map.on('load', () => {
        map.addSource('ratesData', {
            type: 'geojson',
            data: 'assets/us-covid-2020-rates.json'
        });

        map.addLayer({
            'id': 'rates-layer',
            'type': 'fill',
            'source': 'ratesData',
            'paint': {
                'fill-color': [
                    'step',      // use step expression to provide fill color based on values
                    ['get', 'rates'],  // get the rates attribute from the data
                    '#FFEDA0',   // use color #FFEDA0
                    10,          // if rates < 10
                    '#FED976',   // use color #FED976
                    20,          // if 10 <= rates < 20
                    '#FEB24C',   // use color #FEB24C
                    50,          // if 20 <= rates < 50
                    '#FD8D3C',   // use color #FD8D3C
                    100,         // if 50 <= rates < 100
                    '#FC4E2A',   // use color #FC4E2A
                    200,         // if 100 <= rates < 200
                    '#E31A1C',   // use color #E31A1C
                    500,         // if 200 <= rates < 500
                    '#BD0026',   // use color #BD0026
                    1000,        // if 500 <= rates < 1000
                    "#800026"    // use color #800026 if 1000 <= rates
                ],
                'fill-outline-color': '#BBBBBB',
                'fill-opacity': 0.7,
            }
        });
    });

    const layers = [
        '0-9',
        '10-19',
        '20-49',
        '50-99',
        '100-200',
        '200-499',
        '500-999',
        '1000 and more'
    ];
    const colors = [
        '#FFEDA070',
        '#FED97670',
        '#FEB24C70',
        '#FD8D3C70',
        '#FC4E2A70',
        '#E31A1C70',
        '#BD002670',
        '#80002670'
    ];

    const legend = document.getElementById('legend');
    legend.innerHTML = "<b>Covid Case Rates<br>(cases per thousand residents)</b><br><br>";

    layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        const value = document.createElement('span');
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    });

    map.on('mousemove', ({point}) => {
        const state = map.queryRenderedFeatures(point, {
            layers: ['rates-layer']
        });
        document.getElementById('text-description').innerHTML = state.length ?
            `<h3>${state[0].properties.county} County, ${state[0].properties.state}</h3><p><strong>${state[0].properties.pop18}</strong> people, <strong>${state[0].properties.cases}</strong> cases<br><strong>Rate: </strong> ${state[0].properties.rates} cases</p>` :
            `<p>Hover over a county!</p>`;
    });
})();