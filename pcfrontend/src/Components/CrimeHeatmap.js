import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import axios from "axios";
import HeatmapLayer from "./HeatmapLayer";
import useGeoLocation from "./useGeoLocation";
import { Card, Form, Button, Spinner, Container, Row, Col } from "react-bootstrap";

export default function CrimeHeatmap() {
  const location = useGeoLocation();
  const [points, setPoints] = useState([]);
  const [searchLocation, setSearchLocation] = useState("");
  const [mapCenter, setMapCenter] = useState(null);
  const [loading, setLoading] = useState(false);

  const markerIcon = new L.Icon({
    iconUrl: require("./Pin.png"),
    iconSize: [35, 45],
  });

  // 🔁 Helper: move map to a given position
  function RecenterMap({ lat, lng }) {
    const map = useMap();
    useEffect(() => {
      if (lat && lng) map.setView([lat, lng], 13);
    }, [lat, lng, map]);
    return null;
  }

  // 🌍 Fetch all crimes once
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/crimes")
      .then((res) => {
        const formatted = res.data.map((d) => [
          d.latitude,
          d.longitude,
          d.intensity || 1,
        ]);
        setPoints(formatted);
      })
      .catch((err) => console.error("Error loading crime data:", err));
  }, []);

  // 📡 Set initial location when loaded
  useEffect(() => {
    if (location.loaded && !location.error) {
      const { lat, lng } = location.coordinates;
      setMapCenter([lat, lng]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.loaded]);

  // 🔍 Search any location using OpenStreetMap API
  const handleSearch = async () => {
    if (!searchLocation.trim()) return;
    setLoading(true);
    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchLocation}`
      );
      const data = await geoRes.json();
      if (data.length > 0) {
        const { lat, lon } = data[0];
        setMapCenter([parseFloat(lat), parseFloat(lon)]);
      } else {
        alert("❌ Location not found!");
      }
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Reset to user's real location
  const handleReset = () => {
    if (location.loaded && !location.error) {
      const { lat, lng } = location.coordinates;
      setMapCenter([lat, lng]);
    }
  };

  // 🌀 Loading state
  if (!mapCenter)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Fetching current location...</p>
      </div>
    );

  return (
    <Container fluid className="p-0">
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {/* 🔥 Overall Crime Heatmap */}
        <HeatmapLayer points={points} />

        {/* 📍 Marker for selected location */}
        <Marker position={mapCenter} icon={markerIcon}>
          <Popup>
            📍 <b>{searchLocation || "Your Current Location"}</b>
          </Popup>
        </Marker>

        <RecenterMap lat={mapCenter[0]} lng={mapCenter[1]} />
      </MapContainer>

      {/* 🧭 Bottom Search Bar */}
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
}
