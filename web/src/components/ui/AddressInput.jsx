import React, { useState, useEffect } from "react";
import { MapPin, Navigation } from "lucide-react";
import Button from "./Button";

const AddressInput = ({
  value,
  onChange,
  error,
  onCoordinatesChange,
  placeholder = "Enter address",
}) => {
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const geocodeAddress = async (address) => {
    if (!address.trim()) {
      setSuggestions([]);
      return;
    }

    setIsGeocoding(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}&limit=5`
      );
      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Geocoding error:", error);
    } finally {
      setIsGeocoding(false);
    }
  };

  const handleAddressChange = (e) => {
    const newValue = e.target.value;
    onChange(newValue);
    setSelectedAddress(null);
    geocodeAddress(newValue);
  };

  const handleSuggestionClick = (suggestion) => {
    const formattedAddress = `${suggestion.display_name}`;
    onChange(formattedAddress);
    setSelectedAddress(suggestion);
    onCoordinatesChange({
      lat: parseFloat(suggestion.lat),
      lng: parseFloat(suggestion.lon),
    });
    setShowSuggestions(false);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setIsGeocoding(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // Reverse geocode to get address
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();

          onChange(data.display_name);
          onCoordinatesChange({
            lat: latitude,
            lng: longitude,
          });
          setSelectedAddress(data);
        } catch (error) {
          console.error("Reverse geocoding error:", error);
        } finally {
          setIsGeocoding(false);
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsGeocoding(false);
        alert("Unable to retrieve your location");
      }
    );
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleAddressChange}
          placeholder={placeholder}
          className={`w-full px-4 py-2 border ${
            error ? "border-red-500" : "border-gray-300"
          } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
        />
        <button
          type="button"
          onClick={getCurrentLocation}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-500 hover:text-blue-500"
          title="Use current location"
        >
          <Navigation size={20} />
        </button>
      </div>

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
            >
              <MapPin size={16} className="text-gray-500" />
              <span>{suggestion.display_name}</span>
            </button>
          ))}
        </div>
      )}

      {isGeocoding && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
        </div>
      )}
    </div>
  );
};

export default AddressInput;
