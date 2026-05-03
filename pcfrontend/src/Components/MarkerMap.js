import React, { useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import providers from "./osm-providers";

function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng]);
  }, [lat, lng, map]);
  return null;
}

const MarkerMap = ({ lat, lng, crimes = [], range = 2 }) => {
  const mapRef = useRef();
  const ZOOM_LEVEL = 13;

  const userIcon = new L.Icon({
    iconUrl: require("./location.png"),
    iconSize: [35, 45],
  });

  const crimeIcon = new L.Icon({
    iconUrl: require("./radio.png"),
    iconSize: [15, 15],
  });

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={ZOOM_LEVEL}
      ref={mapRef}
      style={{
        height: "60vh",
        width: "90%",
        margin: "auto",
        borderRadius: "10px",
      }}
    >
      <TileLayer url={providers.maptiler.url} />

      <Marker position={[lat, lng]} icon={userIcon}>
        <Popup>
          <b>Your Selected Location</b>
        </Popup>
      </Marker>

      <Circle
        center={[lat, lng]}
        radius={range * 1000}
        pathOptions={{ color: "blue", fillColor: "#a3c4f3", fillOpacity: 0.25 }}
      />

      {crimes.map((crime) => {
        if (!crime.latitude || !crime.longitude) return null;
        return (
          <Marker
            key={crime.id}
            position={[crime.latitude, crime.longitude]}
            icon={crimeIcon}
          >
            <Popup>
              <b>{crime.name}</b>
              <br />
              {crime.description || "No description available."}
              <br />
              <small>
                Intensity: {crime.intensity ?? "N/A"} <br />
                Distance:{" "}
                {crime.distance
                  ? `${crime.distance.toFixed(2)} km`
                  : "Unknown"}
              </small>
            </Popup>
          </Marker>
        );
      })}

      <RecenterMap lat={lat} lng={lng} />
    </MapContainer>
  );
};

export default MarkerMap;
