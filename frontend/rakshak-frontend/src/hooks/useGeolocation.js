import { useEffect, useState } from "react";

export default function useGeolocation() {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    accuracy: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({
        latitude: null,
        longitude: null,
        accuracy: null,
        loading: false,
        error: "Geolocation is not supported",
      });

      return;
    }

    let bestAccuracy = Infinity;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const currentAccuracy = position.coords.accuracy;

        if (currentAccuracy <= bestAccuracy) {
          bestAccuracy = currentAccuracy;

          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: currentAccuracy,
            loading: false,
            error: null,
          });
        }
      },
      (error) => {
        setLocation((current) => ({
          ...current,
          loading: false,
          error: error.message,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return location;
}