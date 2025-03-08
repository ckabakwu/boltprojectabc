import React, { useRef, useEffect, useState } from 'react';
import Map, { Source, Layer, NavigationControl, Marker, Popup } from 'react-map-gl';
import type { MapRef } from 'react-map-gl';
import * as turf from '@turf/turf';
import { defaultMapConfig, serviceAreaLayer, selectedAreaLayer, drawLayer } from '../lib/mapbox';

interface MapComponentProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    id: string;
    coordinates: [number, number];
    title: string;
    description?: string;
  }>;
  serviceAreas?: GeoJSON.FeatureCollection;
  onMarkerClick?: (markerId: string) => void;
  onMapClick?: (event: { lngLat: [number, number] }) => void;
  interactive?: boolean;
  showNavigation?: boolean;
}

const MapComponent: React.FC<MapComponentProps> = ({
  center = [-98.5795, 39.8283], // US center
  zoom = 3,
  markers = [],
  serviceAreas,
  onMarkerClick,
  onMapClick,
  interactive = true,
  showNavigation = true
}) => {
  const mapRef = useRef<MapRef>(null);
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [viewport, setViewport] = useState({
    longitude: center[0],
    latitude: center[1],
    zoom: zoom
  });

  useEffect(() => {
    if (serviceAreas && mapRef.current) {
      // Fit map to service areas bounds
      const bounds = turf.bbox(serviceAreas);
      mapRef.current.fitBounds(
        [[bounds[0], bounds[1]], [bounds[2], bounds[3]]],
        { padding: 50 }
      );
    }
  }, [serviceAreas]);

  const handleMarkerClick = (markerId: string) => {
    setSelectedMarker(markerId);
    onMarkerClick?.(markerId);
  };

  return (
    <Map
      ref={mapRef}
      {...viewport}
      {...defaultMapConfig}
      onMove={evt => setViewport(evt.viewState)}
      onClick={e => onMapClick?.(e)}
      interactive={interactive}
      style={{ width: '100%', height: '100%' }}
    >
      {showNavigation && (
        <NavigationControl position="top-right" />
      )}

      {/* Service Areas Layer */}
      {serviceAreas && (
        <Source type="geojson" data={serviceAreas}>
          <Layer {...serviceAreaLayer} />
        </Source>
      )}

      {/* Markers */}
      {markers.map(marker => (
        <React.Fragment key={marker.id}>
          <Marker
            longitude={marker.coordinates[0]}
            latitude={marker.coordinates[1]}
            onClick={() => handleMarkerClick(marker.id)}
          />
          {selectedMarker === marker.id && (
            <Popup
              longitude={marker.coordinates[0]}
              latitude={marker.coordinates[1]}
              anchor="bottom"
              onClose={() => setSelectedMarker(null)}
            >
              <div className="p-2">
                <h3 className="font-medium">{marker.title}</h3>
                {marker.description && (
                  <p className="text-sm text-gray-500">{marker.description}</p>
                )}
              </div>
            </Popup>
          )}
        </React.Fragment>
      ))}
    </Map>
  );
};

export default MapComponent;