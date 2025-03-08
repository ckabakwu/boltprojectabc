import mapboxgl from 'mapbox-gl';
import { MapboxOptions } from 'react-map-gl';

// Get Mapbox token from environment variables
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

// Default map configuration
export const defaultMapConfig: Partial<MapboxOptions> = {
  style: 'mapbox://styles/mapbox/light-v11',
  minZoom: 2,
  maxZoom: 18,
  dragRotate: false,
  attributionControl: true,
  mapStyle: 'mapbox://styles/mapbox/light-v11'
};

// Map theme styles
export const mapStyles = {
  light: 'mapbox://styles/mapbox/light-v11',
  dark: 'mapbox://styles/mapbox/dark-v11',
  streets: 'mapbox://styles/mapbox/streets-v12',
  satellite: 'mapbox://styles/mapbox/satellite-streets-v12'
};

// Service area style
export const serviceAreaLayer = {
  id: 'service-areas',
  type: 'fill',
  paint: {
    'fill-color': '#3B82F6',
    'fill-opacity': 0.2,
    'fill-outline-color': '#2563EB'
  }
};

// Selected area style
export const selectedAreaLayer = {
  id: 'selected-area',
  type: 'fill',
  paint: {
    'fill-color': '#2563EB',
    'fill-opacity': 0.4,
    'fill-outline-color': '#1D4ED8'
  }
};

// Drawing style
export const drawLayer = {
  id: 'draw-layer',
  type: 'line',
  paint: {
    'line-color': '#EF4444',
    'line-width': 2,
    'line-dasharray': [2, 2]
  }
};

// Utility functions
export const fitBounds = (map: mapboxgl.Map, bounds: number[][]) => {
  map.fitBounds(bounds, {
    padding: 50,
    duration: 1000
  });
};

export const flyToLocation = (map: mapboxgl.Map, coordinates: [number, number]) => {
  map.flyTo({
    center: coordinates,
    zoom: 14,
    duration: 1500
  });
};

export const addMarker = (map: mapboxgl.Map, coordinates: [number, number], color: string = '#3B82F6') => {
  const marker = new mapboxgl.Marker({ color })
    .setLngLat(coordinates)
    .addTo(map);
  return marker;
};

export const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
  const R = 6371; // Earth's radius in km
  const lat1 = coord1[1] * Math.PI / 180;
  const lat2 = coord2[1] * Math.PI / 180;
  const deltaLat = (coord2[1] - coord1[1]) * Math.PI / 180;
  const deltaLon = (coord2[0] - coord1[0]) * Math.PI / 180;

  const a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
          Math.cos(lat1) * Math.cos(lat2) *
          Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};