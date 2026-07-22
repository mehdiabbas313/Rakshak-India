import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

const markerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationMap({ location }) {
  const position = location
    ? [location.latitude, location.longitude]
    : [28.6139, 77.2090]; // Default: New Delhi

  return (
    <div className="mt-10 overflow-hidden rounded-2xl border border-slate-800">
      <MapContainer
        center={position}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "450px", width: "100%" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={position} icon={markerIcon}>
          <Popup>
            You are here.
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default LocationMap;