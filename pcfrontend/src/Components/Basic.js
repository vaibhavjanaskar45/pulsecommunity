import React, { useRef, useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useGeoLocation from "./useGeoLocation";
import { Card, Form, Button, Spinner, Container, Row, Col } from "react-bootstrap";

// 🌍 Helper: Recenter map when coordinates change
function RecenterMap({ lat, lng }) {
  const map = useMap();
  useEffect(() => {
    if (lat && lng) map.setView([lat, lng], 13);
  }, [lat, lng, map]);
  return null;
}

const Basic = () => {
  const [center, setCenter] = useState({ lat: 19.076, lng: 72.8777 }); // Default: Mumbai
  const [crimeData, setCrimeData] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const location = useGeoLocation();
  const mapRef = useRef();

  const markerIcon = new L.Icon({
    iconUrl: require("./location.png"),
    iconSize: [35, 45],
  });

    const crimeIcon = new L.Icon({
    iconUrl: require("./triangle.png"),
    iconSize: [20, 20],
  });

  // 🎯 Fetch crime data
  useEffect(() => {
    fetch("http://localhost:8080/api/crimes")
      .then((res) => res.json())
      .then((data) => setCrimeData(data))
      .catch((err) => console.error("Error fetching crime data:", err));
  }, []);

  // 📍 Set center to user’s location when loaded
  useEffect(() => {
    if (location.loaded && !location.error) {
      setCenter({
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
      });
    }
  }, [location]);

  // 🔍 Search any location using OpenStreetMap API
  const handleSearch = async () => {
    if (!searchLocation.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchLocation}`
      );
      const data = await res.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setCenter({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        alert("❌ Location not found!");
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Reset to user's actual location
  const handleReset = () => {
    if (location.loaded && !location.error) {
      setCenter({
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
      });
    }
  };

  if (!location.loaded)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>📍 Getting your location...</p>
      </div>
    );

  return (
    <Container fluid className="p-0">
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={13}
        ref={mapRef}
        style={{ height: "100vh", width: "100%" }}
      >
        {/* 🌍 Tile Layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* 🗺️ Crime Markers */}
        {crimeData.map((crime) => (
          <Marker
            key={crime.id}
            position={[crime.latitude, crime.longitude]}
            icon={crimeIcon}
          >
            <Popup>
              <div>
                <h5 className="fw-bold text-primary">{crime.name}</h5>
                <p className="mb-1">{crime.description}</p>
                <small> Intensity: {crime.intensity}</small>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 📍 Current or searched location marker */}
        <Marker position={[center.lat, center.lng]} icon={markerIcon}>
          <Popup>
            📍 <b>{searchLocation || "Your Current Location"}</b>
          </Popup>
        </Marker>

        <RecenterMap lat={center.lat} lng={center.lng} />
      </MapContainer>

      {/* 🔎 Bottom Floating Search Bar */}
      <Card
        className="shadow-lg position-absolute bottom-0 start-50 translate-middle-x mb-3 p-3"
        style={{
          zIndex: 1000,
          width: "90%",
          maxWidth: "500px",
          borderRadius: "15px",
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.85)",
        }}
      >
        <Form>
          <Row className="g-2">
            <Col xs={8}>
              <Form.Control
                type="text"
                placeholder="Search any city or place..."
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </Col>
            <Col xs={4} className="d-flex gap-2">
              <Button
                variant="primary"
                onClick={handleSearch}
                disabled={loading}
                className="flex-grow-1"
              >
                {loading ? "..." : "Search"}
              </Button>
              <Button
                variant="outline-danger"
                onClick={handleReset}
                title="Reset to your location"
              >
                ⟳
              </Button>
            </Col>
          </Row>
        </Form>
      </Card>
    </Container>
  );
};

export default Basic;
