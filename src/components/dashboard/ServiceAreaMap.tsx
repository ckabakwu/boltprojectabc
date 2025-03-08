import React, { useRef, useEffect, useState } from 'react';
import Map, { Source, Layer, NavigationControl } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import * as turf from '@turf/turf';
import type { ServiceArea } from '../../lib/supabase';

interface ServiceAreaMapProps {
  serviceAreas: ServiceArea[];
  onAreaSelect?: (area: ServiceArea) => void;
  onAreaCreate?: (geometry: any) => void;
  onAreaUpdate?: (id: string, geometry: any) => void;
  editable?: boolean;
}

const ServiceAreaMap: React.FC<ServiceAreaMapProps> = ({
  serviceAreas,
  onAreaSelect,
  onAreaCreate,
  onAreaUpdate,
  editable = false
}) => {
  const mapRef = useRef<MapRef>(null);
  const [viewport, setViewport] = useState({
    latitude: 39.8283,
    longitude: -98.5795,
    zoom: 3
  });
  const [drawMode, setDrawMode] = useState<'none' | 'polygon' | 'circle'>('none');
  const [drawPoints, setDrawPoints] = useState<number[][]>([]);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  useEffect(() => {
    // Fit map to service areas bounds
    if (serviceAreas.length && mapRef.current) {
      const bounds = serviceAreas.reduce((acc, area) => {
        const areaBounds = turf.bbox(area.boundary);
        return acc ? turf.bbox(turf.union(
          turf.bboxPolygon(acc),
          turf.bboxPolygon(areaBounds)
        )) : areaBounds;
      }, null);

      if (bounds) {
        mapRef.current.fitBounds(
          [[bounds[0], bounds[1]], [bounds[2], bounds[3]]],
          { padding: 50 }
        );
      }
    }
  }, [serviceAreas]);

  const handleClick = (event: any) => {
    if (!editable || drawMode === 'none') return;

    const [lng, lat] = event.lngLat;
    
    if (drawMode === 'polygon') {
      setDrawPoints([...drawPoints, [lng, lat]]);
    } else if (drawMode === 'circle') {
      if (drawPoints.length === 0) {
        // Set center point
        setDrawPoints([[lng, lat]]);
      } else {
        // Calculate radius and create circle
        const center = drawPoints[0];
        const radius = turf.distance(
          turf.point(center),
          turf.point([lng, lat]),
          { units: 'kilometers' }
        );
        
        const circle = turf.circle(center, radius, {
          steps: 64,
          units: 'kilometers'
        });

        onAreaCreate?.(circle.geometry);
        setDrawPoints([]);
        setDrawMode('none');
      }
    }
  };

  const handlePolygonComplete = () => {
    if (drawPoints.length < 3) return;

    const polygon = turf.polygon([
      [...drawPoints, drawPoints[0]] // Close the polygon
    ]);

    onAreaCreate?.(polygon.geometry);
    setDrawPoints([]);
    setDrawMode('none');
  };

  const layerStyle = {
    id: 'service-areas',
    type: 'fill',
    paint: {
      'fill-color': '#3B82F6',
      'fill-opacity': 0.2,
      'fill-outline-color': '#2563EB'
    }
  };

  const selectedLayerStyle = {
    id: 'selected-area',
    type: 'fill',
    paint: {
      'fill-color': '#2563EB',
      'fill-opacity': 0.4,
      'fill-outline-color': '#1D4ED8'
    }
  };

  const drawLayerStyle = {
    id: 'draw-layer',
    type: 'line',
    paint: {
      'line-color': '#EF4444',
      'line-width': 2,
      'line-dasharray': [2, 2]
    }
  };

  return (
    <div className="relative h-full w-full">
      <Map
        ref={mapRef}
        {...viewport}
        onMove={evt => setViewport(evt.viewState)}
        mapStyle="mapbox://styles/mapbox/light-v11"
        onClick={handleClick}
      >
        <NavigationControl position="top-right" />

        {/* Service Areas */}
        <Source
          type="geojson"
          data={{
            type: 'FeatureCollection',
            features: serviceAreas
              .filter(area => area.id !== selectedArea)
              .map(area => ({
                type: 'Feature',
                geometry: area.boundary,
                properties: { id: area.id }
              }))
          }}
        >
          <Layer {...layerStyle} />
        </Source>

        {/* Selected Area */}
        {selectedArea && (
          <Source
            type="geojson"
            data={{
              type: 'Feature',
              geometry: serviceAreas.find(a => a.id === selectedArea)?.boundary,
              properties: {}
            }}
          >
            <Layer {...selectedLayerStyle} />
          </Source>
        )}

        {/* Drawing Preview */}
        {drawPoints.length > 0 && (
          <Source
            type="geojson"
            data={{
              type: 'Feature',
              geometry: {
                type: 'LineString',
                coordinates: drawPoints
              },
              properties: {}
            }}
          >
            <Layer {...drawLayerStyle} />
          </Source>
        )}
      </Map>

      {editable && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-2">
          <div className="space-y-2">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium w-full ${
                drawMode === 'polygon'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setDrawMode(drawMode === 'polygon' ? 'none' : 'polygon')}
            >
              Draw Polygon
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium w-full ${
                drawMode === 'circle'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setDrawMode(drawMode === 'circle' ? 'none' : 'circle')}
            >
              Draw Circle
            </button>
            {drawMode === 'polygon' && drawPoints.length >= 3 && (
              <button
                className="px-4 py-2 rounded-md text-sm font-medium w-full bg-green-600 text-white hover:bg-green-700"
                onClick={handlePolygonComplete}
              >
                Complete Polygon
              </button>
            )}
            {drawMode !== 'none' && (
              <button
                className="px-4 py-2 rounded-md text-sm font-medium w-full bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  setDrawPoints([]);
                  setDrawMode('none');
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceAreaMap;