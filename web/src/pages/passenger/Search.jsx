import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PassengerSearch = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    from: "",
    to: "",
    date: "",
    passengers: 1,
  });

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSearching(true);

    // Mock API call - replace with actual API
    setTimeout(() => {
      setSearchResults([
        {
          id: 1,
          route: "Lagos to Abuja",
          departureTime: "08:00 AM",
          arrivalTime: "02:00 PM",
          duration: "6 hours",
          price: 15000,
          availableSeats: 15,
          busType: "Executive",
          busNumber: "BUS001",
        },
        {
          id: 2,
          route: "Lagos to Abuja",
          departureTime: "10:00 AM",
          arrivalTime: "04:00 PM",
          duration: "6 hours",
          price: 12000,
          availableSeats: 8,
          busType: "Standard",
          busNumber: "BUS002",
        },
      ]);
      setIsSearching(false);
    }, 1000);
  };

  const handleBookNow = (busId) => {
    // TODO: Navigate to booking page with bus details
    navigate(`/passenger/book/${busId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Search Buses</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                From
              </label>
              <input
                type="text"
                name="from"
                value={searchParams.from}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter departure city"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                To
              </label>
              <input
                type="text"
                name="to"
                value={searchParams.to}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="Enter arrival city"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={searchParams.date}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Passengers
              </label>
              <input
                type="number"
                name="passengers"
                value={searchParams.passengers}
                onChange={handleChange}
                min="1"
                max="10"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
              disabled={isSearching}
            >
              {isSearching ? "Searching..." : "Search Buses"}
            </button>
          </div>
        </form>
      </div>

      {searchResults.length > 0 ? (
        <div className="space-y-4">
          {searchResults.map((bus) => (
            <div key={bus.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {bus.route}
                  </h3>
                  <p className="text-secondary">
                    {bus.departureTime} - {bus.arrivalTime} ({bus.duration})
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-gray-900">
                    ₦{bus.price}
                  </p>
                  <p className="text-sm text-secondary">per passenger</p>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-secondary">Bus Type</p>
                  <p className="font-medium">{bus.busType}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary">Available Seats</p>
                  <p className="font-medium">{bus.availableSeats}</p>
                </div>
                <div>
                  <p className="text-sm text-secondary">Bus Number</p>
                  <p className="font-medium">{bus.busNumber}</p>
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleBookNow(bus.id)}
                  className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-secondary">
            {isSearching
              ? "Searching for buses..."
              : "Enter your search criteria to find buses"}
          </p>
        </div>
      )}
    </div>
  );
};

export default PassengerSearch;
