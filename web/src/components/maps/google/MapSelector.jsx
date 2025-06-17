import { useState, useEffect } from "react";
import {
  AddressInput,
  UseCurrentLocationOption,
  SuggestionList,
  GoogleMapView,
} from "./index";
import { StepNavButtons } from "../../agency";

const MapSelector = () => {
  const [address, setAddress] = useState("");
  const [coordinates, setCoordinates] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
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
    if (!window.google) return;

    setLoadingSuggestions(true);
    const service = new window.google.maps.places.AutocompleteService();

    service.getPlacePredictions(
      {
        input: query,
        componentRestrictions: { country: "cm" }, // Restrict to Cameroon
      },
      (predictions, status) => {
        setLoadingSuggestions(false);
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          setSuggestions(predictions || []);
        } else {
          setSuggestions([]);
        }
      }
    );
  };

  const geocodeAddress = (address) => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address }, (results, status) => {
        if (status === "OK" && results[0]) {
          const location = results[0].geometry.location;
          resolve({
            lat: location.lat(),
            lng: location.lng(),
            address: results[0].formatted_address,
          });
        } else {
          reject(new Error("Geocoding failed"));
        }
      });
    });
  };

  const reverseGeocode = (lat, lng) => {
    return new Promise((resolve, reject) => {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject(new Error("Reverse geocoding failed"));
        }
      });
    });
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
      const result = await geocodeAddress(suggestion.description);
      setAddress(result.address);
      setCoordinates({ lat: result.lat, lng: result.lng });
      setSuggestions([]);
      setInputFocused(false);
    } catch (error) {
      console.error("Error geocoding suggestion:", error);
      alert("Could not get coordinates for this address");
    }
  };

  const handleConfirm = async () => {
    if (!address || !coordinates) return;

    try {
      // Simulate API call to save address
      const addressData = {
        address,
        lat: coordinates.lat,
        lng: coordinates.lng,
        timestamp: new Date().toISOString(),
      };

      console.log("Saving address to database:", addressData);

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setConfirmed(true);
      alert("Address saved successfully!");
    } catch (error) {
      console.error("Error saving address:", error);
      alert("Failed to save address. Please try again.");
    }
  };

  const handleBack = () => {
    // Reset or navigate back
    setAddress("");
    setCoordinates(null);
    setConfirmed(false);
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
      <div className="relative mb-6">
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
      <GoogleMapView coordinates={coordinates} address={address} />

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
