import React, { useState, useEffect } from 'react';
import DeckGL from '@deck.gl/react';
import { Map } from 'react-map-gl/maplibre';
import { GeoJsonLayer } from '@deck.gl/layers';
import 'maplibre-gl/dist/maplibre-gl.css';


const getRandomColor = () => {
    return [Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), Math.floor(Math.random() * 256), 200];
};

const getRandomRadius = () => {
    return Math.floor(Math.random() * 20) + 5; // Random radius between 5 and 25
};


const MainComponent = ({ messages }) => {
    const initialViewState = {
        longitude: 103.8198,
        latitude: 1.35,
        zoom: 14,
        pitch: 0,
        bearing: 0
    };

    const [layers, setLayers] = useState([]);
    const [viewState, setViewState] = useState(initialViewState);
    const [tooltip, setTooltip] = useState(null);
    const [layerColors, setLayerColors] = useState({});


    useEffect(() => {
        const newLayers = messages
            .filter(message => message.role === 'assistant')
            .map((message, index) => {
                try {
                    const geojson = JSON.parse(message.content);
                    if (geojson.type === 'FeatureCollection') {
                        const layerId = message.userPrompt;
                        const color = layerColors[layerId] || getRandomColor();
                        setLayerColors(prev => ({ ...prev, [layerId]: color }));
                        return new GeoJsonLayer({
                            id: layerId,
                            data: geojson,
                            pickable: true,
                            stroked: true,
                            filled: true,
                            extruded: false,
                            pointType: 'circle',
                            getFillColor: color,
                            getLineColor: color,
                            getPointRadius: getRandomRadius,
                            getLineWidth: 2,
                            onClick: info => setTooltip(info.object)
                        });
                    }
                } catch (e) {
                    console.error('Invalid GeoJSON:', e);
                }
                return null;
            })
            .filter(layer => layer !== null);

        setLayers(newLayers);
    }, [messages]);

    return (
        <div className="flex h-full p-4 space-x-4">
            <div className="w-1/4 overflow-y-auto bg-gray-100 p-4 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold mb-4">Layers</h3>
                <ul className="space-y-2">
                    {layers.length > 0 ? (
                        layers.map(layer => (
                            <li key={layer.id} className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-200">
                                {layer.id}

                            </li>

                        ))
                    ) : (
                        <li className="p-2 bg-white rounded-lg shadow-sm">No layers</li>
                    )}
                </ul>
            </div>
            <div style={{ width: '80%', height: '100%', position: 'relative' }}>
                <DeckGL
                    viewState={viewState}
                    onViewStateChange={({ viewState }) => setViewState(viewState)}
                    controller={true}
                    layers={layers}
                    style={{ height: '100%' }}
                >
                    <Map
                        mapStyle="https://api.maptiler.com/maps/streets/style.json?key=QQtkGFQfXNO1P2aEiQ8D"
                    />
                </DeckGL>
                {tooltip && (
                    <div style={{ position: 'absolute', zIndex: 1, pointerEvents: 'none', left: tooltip.x, top: tooltip.y, background: 'black', padding: '5px', margin: '2px', borderRadius: '3px', color: "white" }}>
                        <div><strong>Name:</strong> {tooltip?.properties?.name}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MainComponent;