import React, { useState, useEffect } from "react";
import { useSchedules } from "../../../../contexts/dashboard/station_manager/SchedulesContext";
import { ModalWrapper, FormHeader, Input, Select, Button } from "../../../ui";
import { X, Sun, Calendar, CalendarDays, Clock } from "lucide-react";

const AddScheduleModal = ({ isOpen, onClose }) => {
  const { routes, createSchedule, loading, error, success } = useSchedules();

  const initialFormData = {
    routeId: "",
    departureTime: "",
    frequency: "Daily",
    startDate: "",
    endDate: "",
    busType: "Standard",
    activeDays: [],
    status: "Upcoming",
    hour: "12",
    minute: "00",
    ampm: "AM",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData(initialFormData);
      setErrors({});
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTimeChange = (field, value) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      // Update departureTime when time components change
      const hour24 =
        newData.ampm === "PM" && newData.hour !== "12"
          ? (parseInt(newData.hour) + 12).toString().padStart(2, "0")
          : newData.ampm === "AM" && newData.hour === "12"
          ? "00"
          : newData.hour.padStart(2, "0");

      newData.departureTime = `${hour24}:${newData.minute}`;
      return newData;
    });
  };

  const handleFrequencyChange = (frequency) => {
    setFormData((prev) => ({ ...prev, frequency }));
  };

  const handleDayChange = (day) => {
    setFormData((prev) => {
      const activeDays = prev.activeDays.includes(day)
        ? prev.activeDays.filter((d) => d !== day)
        : [...prev.activeDays, day];
      return { ...prev, activeDays };
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.routeId) newErrors.routeId = "Route is required.";
    if (!formData.departureTime)
      newErrors.departureTime = "Departure time is required.";
    if (!formData.startDate) newErrors.startDate = "Start date is required.";
    if (formData.frequency !== "Daily" && formData.activeDays.length === 0) {
      newErrors.activeDays =
        "At least one active day is required for this frequency.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const result = await createSchedule(formData);
    if (result.success) {
      onClose();
    }
  };

  const routeOptions = routes.map((route) => ({
    value: route.id,
    label: `${route.origin.name} to ${route.destination.name}`,
  }));

  const busTypeOptions = [
    { value: "Standard", label: "Standard" },
    { value: "VIP", label: "VIP" },
  ];

  const frequencyOptions = [
    { value: "Daily", label: "Daily", icon: Sun },
    { value: "Weekly", label: "Weekly", icon: Calendar },
    { value: "Monthly", label: "Monthly", icon: CalendarDays },
    { value: "One-time", label: "One-time", icon: Clock },
  ];

  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <div className="p-6 md:p-8 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <FormHeader
          title="Add a schedule"
          subtitle="Define the schedule for your trips"
        />

        <div className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Route Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Choose a route *
              </label>
              <Select
                name="routeId"
                value={formData.routeId}
                onChange={handleChange}
                options={routeOptions}
                error={errors.routeId}
                placeholder="Select a route"
              />
            </div>

            {/* Bus Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bus Type *
              </label>
              <Select
                name="busType"
                value={formData.busType}
                onChange={handleChange}
                options={busTypeOptions}
                error={errors.busType}
              />
            </div>

            {/* Departure Time */}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departure Time *
            </label>
            <div className="flex items-center space-x-2">
              <select
                value={formData.hour}
                onChange={(e) => handleTimeChange("hour", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {hours.map((hour) => (
                  <option key={hour} value={hour}>
                    {hour}
                  </option>
                ))}
              </select>
              <span className="text-gray-500">:</span>
              <select
                value={formData.minute}
                onChange={(e) => handleTimeChange("minute", e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {minutes.map((minute) => (
                  <option key={minute} value={minute}>
                    {minute}
                  </option>
                ))}
              </select>
              <div className="flex bg-gray-100 rounded-md">
                <button
                  type="button"
                  onClick={() => handleTimeChange("ampm", "AM")}
                  className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                    formData.ampm === "AM"
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  AM
                </button>
                <button
                  type="button"
                  onClick={() => handleTimeChange("ampm", "PM")}
                  className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                    formData.ampm === "PM"
                      ? "bg-blue-500 text-white"
                      : "text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  PM
                </button>
              </div>
            </div>
            {errors.departureTime && (
              <p className="text-red-500 text-xs mt-1">
                {errors.departureTime}
              </p>
            )}
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Frequency *
            </label>
            <div className="grid grid-cols-4 gap-3">
              {frequencyOptions.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleFrequencyChange(value)}
                  className={`p-4 rounded-sm border-2 flex flex-col items-center space-y-2 transition-all ${
                    formData.frequency === value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Icon
                    size={20}
                    className={
                      formData.frequency === value
                        ? "text-blue-500"
                        : "text-gray-400"
                    }
                  />
                  <span
                    className={`text-sm font-medium ${
                      formData.frequency === value
                        ? "text-blue-500"
                        : "text-gray-700"
                    }`}
                  >
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date *
              </label>
              <Input
                name="startDate"
                type="date"
                value={formData.startDate}
                onChangeHandler={handleChange}
                error={errors.startDate}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date *
              </label>
              <Input
                name="endDate"
                type="date"
                value={formData.endDate}
                onChangeHandler={handleChange}
                error={errors.endDate}
              />
            </div>
          </div>

          {/* Active Days (for Weekly/Monthly) */}
          {(formData.frequency === "Weekly" ||
            formData.frequency === "Monthly") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Active Days
              </label>
              <div className="flex flex-wrap gap-2">
                {daysOfWeek.map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayChange(day)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.activeDays.includes(day)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
              {errors.activeDays && (
                <p className="text-red-500 text-xs mt-1">{errors.activeDays}</p>
              )}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end mt-8">
          <Button
            onClickHandler={handleSave}
            additionalClasses="bg-blue-500 hover:bg-blue-600 text-white px-8"
            isLoading={loading}
          >
            Save Schedule
          </Button>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <p className="text-red-500 text-sm mt-4 text-right">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-sm mt-4 text-right">{success}</p>
        )}
      </div>
    </ModalWrapper>
  );
};

export default AddScheduleModal;
