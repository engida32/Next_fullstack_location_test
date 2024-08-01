"use client";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

interface Location {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

const MapEvents = ({
  onLocationAdded,
}: {
  onLocationAdded: (lat: number, lng: number) => void;
}) => {
  useMapEvents({
    click(e) {
      onLocationAdded(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const MapAndLocations = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [newLocationName, setNewLocationName] = useState("");
  const [route, setRoute] = useState<Location[]>([]);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    const response = await fetch("/api/locations");
    if (!response.ok) {
      const data = await response.json();
      setLocations(data);
    } else {
      alert("Failed to fetch locations");
    }
  };
  const deleteLocations = async () => {
    const response = await fetch("/api/locations", {
      method: "DELETE",
    });
    if (response.ok) {
      setLocations([]);
    } else {
      alert("Failed to delete locations");
    }
  };

  const handleLocationAdded = async (lat: number, lng: number) => {
    if (newLocationName.trim() === "") {
      alert("Please enter a name for the location");
      return;
    }

    const response = await fetch("/api/locations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: newLocationName,
        latitude: lat,
        longitude: lng,
      }),
    });

    if (response.ok) {
      setNewLocationName("");
      fetchLocations();
    } else {
      alert("Failed to add location");
    }
  };

  const calculateRoute = async () => {
    const response = await fetch("/api/calculate-route");
    if (response.ok) {
      const calculatedRoute = await response.json();
      setRoute(calculatedRoute);
    } else {
      alert("Failed to calculate route");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <div style={{ width: "70%" }}>
        <MapContainer
          center={[51.505, -0.09]}
          zoom={13}
          style={{ height: "600px" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <MapEvents onLocationAdded={handleLocationAdded} />
          {locations.map((location) => (
            <Marker
              key={location.id}
              position={[location.latitude, location.longitude]}
              title={location.name}
            />
          ))}
          {route.length > 0 && (
            <>
              <Polyline
                positions={[...route, route[0]].map((loc) => [
                  loc.latitude,
                  loc.longitude,
                ])}
                color="red"
              />
            </>
          )}
        </MapContainer>
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            gap: "10px",
          }}
        >
          {" "}
          <input
            type="text"
            value={newLocationName}
            onChange={(e) => setNewLocationName(e.target.value)}
            placeholder="Enter location name"
            style={{
              width: "calc(50% - 120px)",
              padding: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              marginRight: "10px",
              boxSizing: "border-box",
            }}
          />
          <p>Click on the map to add a new location</p>
          <button
            onClick={calculateRoute}
            style={{
              padding: "10px 20px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#0070f3",
              color: "#fff",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background-color 0.3s",
            }}
          >
            Calculate Route
          </button>
          <button
            onClick={deleteLocations}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              borderRadius: "4px",
              border: "none",
              backgroundColor: "#e63946",
              color: "#fff",
              cursor: "pointer",
              fontSize: "16px",
              transition: "background-color 0.3s",
              marginLeft: "10px",
            }}
          >
            Delete Saved Locations
          </button>
        </div>
      </div>
      <div style={{ width: "30%", padding: "20px" }}>
        <h2>Saved Locations</h2>
        <ul>
          {locations.map((location) => (
            <li key={location.id}>
              {location.name} ({location.latitude.toFixed(4)},{" "}
              {location.longitude.toFixed(4)})
            </li>
          ))}
        </ul>
        {route.length > 0 && (
          <div>
            <h3>Calculated Route</h3>
            <ol>
              {[...route, route[0]].map((location, index) => (
                <li key={index}>{location.name}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapAndLocations;
