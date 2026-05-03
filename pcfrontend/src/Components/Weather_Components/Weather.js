import React, { useEffect, useState } from "react";
import useGeoLocation from "../useGeoLocation";
import { Card, Spinner, Container } from "react-bootstrap";

function Weather() {
  const location = useGeoLocation();
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.loaded && !location.error) {
      const fetchWeather = async () => {
        try {
          const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${location.coordinates.lat}&lon=${location.coordinates.lng}&units=metric&appid=${process.env.REACT_APP_WEATHER_API}`
          );
          if (!res.ok) throw new Error("Failed to fetch weather data");
          const data = await res.json();
          setWeather(data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchWeather();
    }
  }, [location]);

  // UI states
  if (error)
    return (
      <p className="text-danger text-center mt-5 fs-5 fw-semibold">
        ❌ {error}
      </p>
    );

  if (!location.loaded)
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 fs-6 text-muted">📍 Detecting your location...</p>
      </div>
    );

  if (!weather)
    return (
      <div className="text-center mt-5">
        <Spinner animation="grow" variant="info" />
        <p className="mt-2 fs-6 text-muted">🌦 Fetching latest weather data...</p>
      </div>
    );

  // Extract details
  const {
    name,
    main: { temp, feels_like, humidity, pressure },
    weather: weatherDetails,
    wind,
  } = weather;

  const description = weatherDetails[0].description;
  const icon = weatherDetails[0].icon;
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

  // Dynamic background based on temperature
  const getBackground = () => {
    if (temp < 15) return "linear-gradient(135deg, #74ABE2, #5563DE)";
    if (temp < 30) return "linear-gradient(135deg, #6EE7B7, #3B82F6)";
    return "linear-gradient(135deg, #FCD34D, #F87171)";
  };

  return (
    <Container className="d-flex justify-content-center align-items-center mt-5">
      <Card
        className="shadow-lg border-0 text-center text-white"
        style={{
          width: "45rem",
          background: getBackground(),
          borderRadius: "20px",
          transition: "0.4s ease-in-out",
        }}
      >
        <Card.Body>
          <h2 className="fw-bold mb-3">{name}</h2>
          <img
            src={iconUrl}
            alt={description}
            style={{
              width: "100px",
              height: "100px",
              filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.3))",
            }}
          />
          <h1 className="fw-bold mt-2">{Math.round(temp)}°C</h1>
          <p className="text-capitalize mb-1 fs-5">{description}</p>
          <p className="text-light mb-3">Feels like {Math.round(feels_like)}°C</p>

          <hr className="border-light opacity-50" />

          <div className="d-flex justify-content-around mt-3">
            <div>
              <p className="mb-1 fw-semibold">💨 Wind</p>
              <p>{wind.speed} m/s</p>
            </div>
            <div>
              <p className="mb-1 fw-semibold">💧 Humidity</p>
              <p>{humidity}%</p>
            </div>
            <div>
              <p className="mb-1 fw-semibold">🌡 Pressure</p>
              <p>{pressure} hPa</p>
            </div>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Weather;
