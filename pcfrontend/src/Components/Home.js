import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Card, Button, Form, Row, Col } from "react-bootstrap";
import { AuthContext } from "../Context/AuthContext";
import useGeoLocation from "./useGeoLocation";
import MarkerMap from "./MarkerMap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// ✅ Helper: Haversine formula
const getDistance = (lat1, lon1, lat2, lon2) => {
  const toRad = (val) => (Math.PI / 180) * val;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Home = () => {
  document.title = "Pulse Community | Home";

  const location = useGeoLocation();
  const { user } = useContext(AuthContext);

  const [crimes, setCrimes] = useState([]);
  const [filteredCrimes, setFilteredCrimes] = useState([]);
  const [range, setRange] = useState(2);
  const [searchQuery, setSearchQuery] = useState("");
  const [manualCoords, setManualCoords] = useState(null);
  const [useManual, setUseManual] = useState(false);
  const [filters, setFilters] = useState({
    crimeType: "",
    riskGroup: "",
    severity: "",
  });

  // ✅ Fetch crimes
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/crimes")
      .then((res) => setCrimes(res.data))
      .catch((err) => console.error("Error fetching crimes:", err));
  }, []);

  // ✅ Handle filter input
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // ✅ Apply text/risk/severity filters
  const applyFilters = (list) => {
    let result = list;

    if (filters.crimeType)
      result = result.filter((c) =>
        c.name.toLowerCase().includes(filters.crimeType.toLowerCase())
      );

    if (filters.riskGroup)
      result = result.filter(
        (c) => c.riskGroup?.toLowerCase() === filters.riskGroup.toLowerCase()
      );

    if (filters.severity) {
      const severityMap = { Low: [1, 2], Medium: [3], High: [4, 5] };
      const range = severityMap[filters.severity];
      result = result.filter((c) => range.includes(c.intensity));
    }

    return result;
  };

  // ✅ Manual location search
  const handleSearchLocation = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery
        )}`
      );
      if (res.data && res.data.length > 0) {
        const { lat, lon } = res.data[0];
        setManualCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
        setUseManual(true);
      } else {
        alert("Location not found. Try another place.");
      }
    } catch (err) {
      console.error("Error fetching manual location:", err);
    }
  };

  // ✅ Compute filtered crimes when location/range changes
  useEffect(() => {
    let refCoords = useManual ? manualCoords : location.coordinates;
    if (!refCoords || !refCoords.lat || !refCoords.lng) return;

    let nearby = crimes
      .map((crime) => {
        if (!crime.latitude || !crime.longitude) return null;
        const distance = getDistance(
          refCoords.lat,
          refCoords.lng,
          crime.latitude,
          crime.longitude
        );
        return { ...crime, distance };
      })
      .filter((crime) => crime && crime.distance <= range)
      .sort((a, b) => a.distance - b.distance);

    nearby = applyFilters(nearby);
    setFilteredCrimes(nearby);
  }, [range, crimes, location, manualCoords, useManual, filters]);

  // ✅ Send user’s location to backend
  useEffect(() => {
    if (location.loaded && !location.error && user?.email) {
      axios
        .post("http://localhost:8080/api/users/location", {
          email: user.email,
          latitude: location.coordinates.lat,
          longitude: location.coordinates.lng,
        })
        .then(() => console.log("✅ Location sent successfully"))
        .catch((err) => console.error("Error sending location:", err));
    }
  }, [location, user]);

  // ✅ Chart Data
  const chartData = Object.values(
    filteredCrimes.reduce((acc, curr) => {
      if (!acc[curr.name]) acc[curr.name] = { name: curr.name, count: 0 };
      acc[curr.name].count += 1;
      return acc;
    }, {})
  );

  // ✅ All Crime Data (no filters)
  const allCrimeData = Object.values(
    crimes.reduce((acc, curr) => {
      if (!acc[curr.name]) acc[curr.name] = { name: curr.name, count: 0 };
      acc[curr.name].count += 1;
      return acc;
    }, {})
  );

  const COLORS = ["#007bff", "#00C49F", "#FFBB28", "#FF8042", "#AA46BE", "#FF6666"];

  const refCoords = useManual
    ? manualCoords
    : location.coordinates && location.coordinates.lat
    ? location.coordinates
    : null;

  return (
    <div className="container mt-4">
      {/* 🔹 Combined Chart Section */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h4 className="text-center mb-4"> Crime Statistics Overview</h4>
          <Row>
            {/* Filtered Crimes - Bar Chart */}
            <Col md={6} sm={12}>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#007bff" barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted">
                  No nearby crime data available
                </p>
              )}
              <h6 className="text-center mt-2 text-muted">
                Crimes within selected range
              </h6>
            </Col>

            {/* All Crimes - Pie Chart */}
            <Col md={6} sm={12}>
              {allCrimeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={allCrimeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {allCrimeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-muted">
                  No overall crime data available
                </p>
              )}
              <h6 className="text-center mt-2 text-muted">
                Distribution of all recorded crimes
              </h6>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 🔹 Location & Range Section */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h3 className="mb-3">🔍 Crime Search & Safety Overview</h3>

          {/* Select location source */}
          <Form.Group as={Row} className="mb-3">
            <Col md={4}>
              <Form.Check
                type="radio"
                label="Use Current Location"
                name="locOption"
                checked={!useManual}
                onChange={() => setUseManual(false)}
              />
            </Col>
            <Col md={4}>
              <Form.Check
                type="radio"
                label="Search Another Location"
                name="locOption"
                checked={useManual}
                onChange={() => setUseManual(true)}
              />
            </Col>
          </Form.Group>

          {/* Manual search */}
          {useManual && (
            <Form onSubmit={handleSearchLocation} className="mb-3">
              <Row>
                <Col md={8}>
                  <Form.Control
                    type="text"
                    placeholder="Search another location (e.g., Mumbai, Pune)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </Col>
                <Col md={4}>
                  <Button type="submit" variant="primary" className="w-100">
                    Search
                  </Button>
                </Col>
              </Row>
            </Form>
          )}

          {/* Range filter */}
          <Row className="align-items-center mb-3">
            <Col md={4}>
              <Form.Label>Range (in km)</Form.Label>
              <Form.Control
                type="number"
                min="0.5"
                max="50"
                step="0.5"
                value={range}
                onChange={(e) => setRange(parseFloat(e.target.value))}
              />
            </Col>
          </Row>

          {/* Filters */}
          <Row className="g-3 mb-3">
            <Col md={4}>
              <Form.Label>Crime Type</Form.Label>
              <Form.Control
                type="text"
                name="crimeType"
                value={filters.crimeType}
                onChange={handleFilterChange}
                placeholder="e.g., Robbery, Assault"
              />
            </Col>
            <Col md={4}>
              <Form.Label>Risk Group</Form.Label>
              <Form.Select
                name="riskGroup"
                value={filters.riskGroup}
                onChange={handleFilterChange}
              >
                <option value="">Select</option>
                <option>Women</option>
                <option>Children</option>
                <option>Traveler</option>
                <option>Senior Citizen</option>
                <option>Student</option>
                <option>Local Resident</option>
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>Severity</Form.Label>
              <Form.Select
                name="severity"
                value={filters.severity}
                onChange={handleFilterChange}
              >
                <option value="">All</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </Form.Select>
            </Col>
          </Row>

          <hr />

          {/* Location Display & Crimes */}
          {refCoords ? (
            <>
              <h5>📍 Selected Location</h5>
              <p>
                Latitude: {refCoords.lat.toFixed(4)}, Longitude:{" "}
                {refCoords.lng.toFixed(4)}
              </p>

              {filteredCrimes.length > 0 ? (
                <>
                  <h5 className="mt-3">
                    Crimes within {range} km:{" "}
                    <span className="text-danger">
                      ({filteredCrimes.length} found)
                    </span>
                  </h5>
                  <ul>
                    {filteredCrimes.map((crime) => (
                      <li key={crime.id}>
                        <strong>{crime.name}</strong> — {crime.description}{" "}
                        <small className="text-muted">
                          ({crime.distance.toFixed(2)} km away)
                        </small>
                      </li>
                    ))}
                  </ul>
                </>
              ) : (
                <p className="text-success fw-bold">
                  ✅ You are in a Safe Area right now.
                </p>
              )}

              <div className="mt-4">
                <MarkerMap
                  lat={refCoords.lat}
                  lng={refCoords.lng}
                  crimes={filteredCrimes}
                  range={range}
                />
              </div>
            </>
          ) : (
            <p>{location.error ? location.error.message : "Loading..."}</p>
          )}
        </Card.Body>
      </Card>

      {/* 🔹 News & Weather Section */}
      <div className="row mb-4">
        <div className="col-md-6">
          <Card className="shadow-sm">
            <Card.Body>
              <h5>📰 Latest News</h5>
              <p>Stay informed about recent crime reports in your area.</p>
              <Button variant="primary" href="/news">
                Read More
              </Button>
            </Card.Body>
          </Card>
        </div>

        <div className="col-md-6">
          <Card className="shadow-sm">
            <Card.Body>
              <h5>🌦 Weather Updates</h5>
              <p>Check weather conditions for safer travel planning.</p>
              <Button variant="info" href="/Weather">
                View Weather
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* 🔹 Footer */}
      <footer className="text-center text-muted mt-4 mb-3">
        © 2025 PulseCommunity | Developed by Vaibhav Janaskar
      </footer>
    </div>
  );
};

export default Home;
