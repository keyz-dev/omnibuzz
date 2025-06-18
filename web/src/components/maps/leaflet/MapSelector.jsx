import { useState, useEffect } from "react";
import {
  AddressInput,
  UseCurrentLocationOption,
  SuggestionList,
  LeafletMapView,
} from "./index";
import { StepNavButtons } from "../../agency";

// Main MapSelector Component
const MapSelector = ({
  prevStep,
  handleConfirm,
  coordinates,
  setCoordinates,
  address,
  setAddress,
}) => {
  const [inputFocused, setInputFocused] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Debounce search
  useEffect(() => {
    if (!address || address.length < 3) {
      setSuggestions([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchPlaces(address);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [address]);

  const searchPlaces = async (query) => {
    setLoadingSuggestions(true);

    try {
      // Using Nominatim API for geocoding (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&countrycodes=cm&limit=5&addressdetails=1`
      );
      const results = await response.json();

      setSuggestions(results || []);
    } catch (error) {
      console.error("Error searching places:", error);
      setSuggestions([]);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const result = await response.json();
      return result.display_name || "Unknown location";
    } catch (error) {
      console.error("Error reverse geocoding:", error);
      return "Unknown location";
    }
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const coords = { lat: latitude, lng: longitude };
          const addressText = await reverseGeocode(latitude, longitude);

          setCoordinates(coords);
          setAddress(addressText);
          setSuggestions([]);
          setInputFocused(false);
        } catch (error) {
          console.error("Error getting address:", error);
          alert("Could not get address for your location");
        } finally {
          setLoadingLocation(false);
        }
      },
      (error) => {
        setLoadingLocation(false);
        console.error("Error getting location:", error);
        alert("Could not get your current location");
      }
    );
  };

  const handleSuggestionSelect = async (suggestion) => {
    try {
      const coords = {
        lat: parseFloat(suggestion.lat),
        lng: parseFloat(suggestion.lon),
      };

      setAddress(suggestion.display_name);
      setCoordinates(coords);
      setSuggestions([]);
      setInputFocused(false);
    } catch (error) {
      console.error("Error processing suggestion:", error);
      alert("Could not process this address");
    }
  };

  const handleBack = () => {
    prevStep();
    setAddress("");
    setCoordinates(null);
    setSuggestions([]);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Is the marker on the right spot?
        </h1>
        <p className="text-secondary">
          confirm the address of the station by checking the marker
        </p>
      </div>

      {/* Address Input Section */}
      <div className="relative mb-6 z-10">
        <AddressInput
          value={address}
          onChange={setAddress}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setTimeout(() => setInputFocused(false), 200)}
          focused={inputFocused}
        />

        <UseCurrentLocationOption
          visible={inputFocused && !coordinates}
          onUseLocation={handleUseCurrentLocation}
          loading={loadingLocation}
        />

        <SuggestionList
          suggestions={suggestions}
          visible={inputFocused && address.length >= 3}
          onSelect={handleSuggestionSelect}
          loading={loadingSuggestions}
        />
      </div>

      {/* Map */}
      <LeafletMapView coordinates={coordinates} address={address} />

      {/* Navigation Buttons */}
      <StepNavButtons
        onBack={handleBack}
        onContinue={handleConfirm}
        canContinue={!!coordinates && !!address}
      />
    </div>
  );
};

export default MapSelector;
