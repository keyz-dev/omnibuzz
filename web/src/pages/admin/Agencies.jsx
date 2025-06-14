import { useState } from "react";
import { useAuth } from "../../stateManagement/contexts/AuthContext";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

const Agencies = () => {
  const { user } = useAuth();
  const [agencies, setAgencies] = useState([
    {
      id: 1,
      name: "City Bus Services",
      location: "New York",
      contactPerson: "John Doe",
      email: "john@citybus.com",
      phone: "+1 234-567-8900",
      status: "Active",
      joinedDate: "2024-03-15",
    },
    {
      id: 2,
      name: "Metro Transit",
      location: "Boston",
      contactPerson: "Jane Smith",
      email: "jane@metrotran.com",
      phone: "+1 234-567-8901",
      status: "Active",
      joinedDate: "2024-03-14",
    },
    {
      id: 3,
      name: "Express Travel",
      location: "Philadelphia",
      contactPerson: "Mike Johnson",
      email: "mike@expresstravel.com",
      phone: "+1 234-567-8902",
      status: "Pending",
      joinedDate: "2024-03-13",
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    contactPerson: "",
    email: "",
    phone: "",
    status: "Pending",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleOpenModal = (agency = null) => {
    if (agency) {
      setSelectedAgency(agency);
      setFormData({
        name: agency.name,
        location: agency.location,
        contactPerson: agency.contactPerson,
        email: agency.email,
        phone: agency.phone,
        status: agency.status,
      });
    } else {
      setSelectedAgency(null);
      setFormData({
        name: "",
        location: "",
        contactPerson: "",
        email: "",
        phone: "",
        status: "Pending",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAgency(null);
    setFormData({
      name: "",
      location: "",
      contactPerson: "",
      email: "",
      phone: "",
      status: "Pending",
    });
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // TODO: Implement agency creation/update
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (selectedAgency) {
        setAgencies((prev) =>
          prev.map((agency) =>
            agency.id === selectedAgency.id
              ? {
                  ...agency,
                  ...formData,
                }
              : agency
          )
        );
      } else {
        const newAgency = {
          id: agencies.length + 1,
          ...formData,
          joinedDate: new Date().toISOString().split("T")[0],
        };
        setAgencies((prev) => [...prev, newAgency]);
      }

      handleCloseModal();
    } catch (error) {
      setErrors({
        submit: error.message || "Failed to save agency",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (agencyId) => {
    if (!window.confirm("Are you sure you want to delete this agency?")) return;

    try {
      // TODO: Implement agency deletion
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setAgencies((prev) => prev.filter((agency) => agency.id !== agencyId));
    } catch (error) {
      alert(error.message || "Failed to delete agency");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Agencies Management
        </h1>
        <Button onClick={() => handleOpenModal()}>Add New Agency</Button>
      </div>

      {/* Agencies List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agency Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact Person
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Joined Date
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {agencies.map((agency) => (
              <tr key={agency.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {agency.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {agency.location}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {agency.contactPerson}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {agency.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {agency.phone}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      agency.status === "Active"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {agency.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {agency.joinedDate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleOpenModal(agency)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(agency.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Agency Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedAgency ? "Edit Agency" : "Add New Agency"}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Agency Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={errors.name}
                />
                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  error={errors.location}
                />
                <Input
                  label="Contact Person"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  error={errors.contactPerson}
                />
                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                />
                <Input
                  label="Phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Pending">Pending</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {errors.submit && (
                <div className="mt-4 text-sm text-red-600">{errors.submit}</div>
              )}

              <div className="mt-6 flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseModal}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={isLoading}>
                  {selectedAgency ? "Update Agency" : "Add Agency"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agencies;
