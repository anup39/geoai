'use client'

import React, { useState } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import { LineLayer, GeoJsonLayer } from '@deck.gl/layers';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAPTILER_ACCESS_TOKEN = 'QQtkGFQfXNO1P2aEiQ8D';

const MainComponent = ({ children, isSidebarExpanded }) => {
  const initialViewState = {
    longitude: -122.4,
    latitude: 37.8,
    zoom: 14,
    pitch: 0,
    bearing: 0
  };

  const new_geojson = {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "properties": {},
        "geometry": {
          "coordinates": [
            [
              [
                85.28148412114132,
                27.692604510496423
              ],
              [
                85.28496678165584,
                27.687208024891902
              ],
              [
                85.28961090972274,
                27.686949162026053
              ],
              [
                85.29396773038007,
                27.684373231339734
              ],
              [
                85.30180740376119,
                27.68437285929653
              ],
              [
                85.30093595410915,
                27.67434571685648
              ],
              [
                85.3064545233596,
                27.667142606163267
              ],
              [
                85.313988729105,
                27.66381951773107
              ],
              [
                85.32383031204512,
                27.657679707851415
              ],
              [
                85.33285663241554,
                27.666387212295533
              ],
              [
                85.34070689277064,
                27.671777773718134
              ],
              [
                85.34970833680381,
                27.67794750090603
              ],
              [
                85.34910632563691,
                27.684380778965675
              ],
              [
                85.35606870447089,
                27.696973252843847
              ],
              [
                85.35345424702177,
                27.700313748916486
              ],
              [
                85.35258135020348,
                27.703910824758054
              ],
              [
                85.3508352808841,
                27.706479744754006
              ],
              [
                85.34734799118058,
                27.705195015124616
              ],
              [
                85.34385889255208,
                27.707249457011713
              ],
              [
                85.34677947098254,
                27.71649983718541
              ],
              [
                85.3447390014415,
                27.72394654514858
              ],
              [
                85.34587280422966,
                27.729328489615924
              ],
              [
                85.3397613205126,
                27.739069728440597
              ],
              [
                85.33166418969597,
                27.74267966655094
              ],
              [
                85.31398757488353,
                27.734225521662225
              ],
              [
                85.30585757405578,
                27.73601706815458
              ],
              [
                85.30499274543763,
                27.72703491796753
              ],
              [
                85.28351628361867,
                27.718545063520367
              ],
              [
                85.28148412114132,
                27.692604510496423
              ]
            ]
          ],
          "type": "Polygon"
        }
      }
    ]
  };

  const dummyLineData = [
    { sourcePosition: [-122.4, 37.8], targetPosition: [-122.5, 37.7] },
    { sourcePosition: [-122.5, 37.7], targetPosition: [-122.6, 37.8] }
  ];
  

  const [layers, setLayers] = useState([
    new LineLayer({
      id: 'line-layer',
      data: dummyLineData,
      getSourcePosition: d => d.sourcePosition,
      getTargetPosition: d => d.targetPosition,
      getColor: [255, 0, 0],
      getWidth: 5
    })
  ]);

  const [viewState, setViewState] = useState(initialViewState);

  const handleAddNewGeojson = () => {
    const newLayer = new GeoJsonLayer({
      id: 'geojson-layer',
      data: new_geojson,
      pickable: true,
      stroked: false,
      filled: true,
      extruded: false,
      getFillColor: [160, 160, 180, 200],
      getLineColor: [255, 100, 100],
      getLineWidth: 1,
    });

    // setLayers([...layers, newLayer]);



    // Calculate the bounding box of the new GeoJSON data
    const bounds = new_geojson.features[0].geometry.coordinates[0].reduce(
      (acc, coord) => {
        return [
          [Math.min(acc[0][0], coord[0]), Math.min(acc[0][1], coord[1])],
          [Math.max(acc[1][0], coord[0]), Math.max(acc[1][1], coord[1])]
        ];
      },
      [[Infinity, Infinity], [-Infinity, -Infinity]]
    );

    // Update the view state to fit the new GeoJSON data
    setViewState({
      ...viewState,
      longitude: (bounds[0][0] + bounds[1][0]) / 2,
      latitude: (bounds[0][1] + bounds[1][1]) / 2,
      zoom: Math.min(
        20,
        Math.max(
          0,
          Math.log2(360 / Math.max(bounds[1][0] - bounds[0][0], bounds[1][1] - bounds[0][1]))
        )
      )
    });
  };

  const handleRemovelayer = () => {
    setLayers([]);
  }
  

  return (
    <DeckGL
      viewState={viewState}
      onViewStateChange={({ viewState }) => setViewState(viewState)}
      controller={true}
      layers={layers}
    >
      <Map 
        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=QQtkGFQfXNO1P2aEiQ8D"
      />
      <button onClick={handleAddNewGeojson}>Add new GeoJSON</button>
      <button onClick={handleRemovelayer}>Remove GeoJSON</button>
    </DeckGL>
  );
};

export default MainComponent;