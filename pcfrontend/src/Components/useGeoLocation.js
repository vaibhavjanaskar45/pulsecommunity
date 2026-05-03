import { useState, useEffect } from "react";

const useGeoLocation = () => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: "", lng: "" },
  });

  const onSuccess = (pos) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      },
    });
  };

  const onError = (error) => {
    setLocation({
      loaded: true,
      error,
    });
  };

  useEffect(() => {
    if (!("geolocation" in navigator)) {
      setLocation({
        loaded: true,
        error: {
          code: 0,
          message: "Geolocation not supported",
        },
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
    // You can also use `watchPosition` if you want real-time tracking
  }, []);

  return location;
};

export default useGeoLocation;
