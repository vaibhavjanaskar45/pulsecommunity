import React, { useRef, useState ,useEffect} from "react";
import { MapContainer, TileLayer, FeatureGroup , Marker, Popup} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import osm from "./osm-providers"; 
import L from "leaflet";


const DrawMap = () => {
  const [center] = useState({ lat: 19.0760, lng: 72.8777 }); // Mumbai as default center
  const ZOOM_LEVEL = 12;
  const mapRef = useRef();
  const [crimeData, setCrimeData] = useState([]); 

  const onCreated = (e) => {
    console.log("Shape created:", e);
  };

  const onEdited = (e) => {
    console.log("Shape(s) edited:", e);
  };

  const onDeleted = (e) => {
    console.log("Shape(s) deleted:", e);
  };


  // custom marker icon
  const markerIcon = new L.Icon({
    iconUrl: require("./Pin.png"),
    iconSize: [35, 45],
  });

    // fetch crime data from backend
    useEffect(() => {
      fetch("http://localhost:8080/api/crimes")
        .then((res) => res.json())
        .then((data) => {
          setCrimeData(data);
        })
        .catch((err) => {
          console.error("Error fetching crime data:", err);
        });
    }, []);

  return (
    <div className="container mt-3">
      <h2 className="text-center mb-3">Draw Shapes on Map</h2>

      <MapContainer
        center={center}
        zoom={ZOOM_LEVEL}
        style={{ height: "80vh", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          url={osm.maptiler.url}
          attribution={osm.maptiler.attribution}
        />

            {/* Loop through crime data and show markers */}
            {crimeData.map((crime) => (
              <Marker
                key={crime.id}
                position={[crime.latitude, crime.longitude]}
                icon={markerIcon}
              >
                <Popup>
                  <div>
                    <h3>{crime.name}</h3>
                    <p>{crime.description}</p>
                    <p>
                      <b>Intensity:</b> {crime.intensity}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}


        <FeatureGroup>
          <EditControl
            position="topright" // control buttons position
            onCreated={onCreated}
            onEdited={onEdited}
            onDeleted={onDeleted}
            draw={{
              rectangle: true,
              polygon: true,
              circle: true,
              polyline: false,
              marker: true,
              circlemarker: false,
            }}
          />
        </FeatureGroup>
      </MapContainer>

    </div>
  );
};

export default DrawMap;
