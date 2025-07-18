import React, { useState, useEffect } from "react";
import { useAgencyStation } from "../../../../contexts/dashboard/agency_admin";
import { Input, Button, FormHeader, Select, ModalWrapper } from "../../../ui";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { isValidCMNumber } from "../../../../utils/validateForm";
import { normalizeNumber } from "../../../../utils/normalizePhone";
import { useAgencyStaff } from "../../../../contexts/dashboard/agency_admin";

const AddWorkerModal = ({ isOpen, onClose, station }) => {
  const { stations, loading, fetchStations } = useAgencyStation();
  const { addStaff } = useAgencyStaff();

  const [worker, setWorker] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "",
    stationId: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (stations.length === 0) {
      fetchStations();
    }
  }, [stations, fetchStations]);

  useEffect(() => {
    if (station) {
      setWorker((w) => ({ ...w, stationId: station.id }));
    }
  }, [station]);

  useEffect(() => {
    if (!isOpen) {
      setWorker({
        fullName: "",
        email: "",
        phone: "",
        role: "",
        stationId: station ? station.id : "",
      });
      setErrors({});
    }
  }, [isOpen, station]);

  const validate = () => {
    const newErrors = {};
    if (!worker.fullName) newErrors.fullName = "Full name is required.";
    if (!worker.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(worker.email)) {
      newErrors.email = "Invalid email address.";
    }
    if (!worker.phone) {
      newErrors.phone = "Phone number is required.";
    } else if (!isValidCMNumber(worker.phone)) {
      newErrors.phone = "Invalid phone number.";
    }
    if (!worker.role) newErrors.role = "Role is required.";
    if (!worker.stationId) newErrors.stationId = "Station is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const workerData = {
      ...worker,
      phone: normalizeNumber(worker.phone),
    };
    await addStaff(workerData);
    onClose();
  };

  if (!isOpen) return null;

  const roleOptions = [
    { value: "station_manager", label: "Station Manager" },
    { value: "ticket_agent", label: "Ticket Agent" },
  ];

  const stationOptions =
    stations?.map((s) => ({ value: s.id, label: s.name })) || [];

  const isFormIncomplete =
    !worker.fullName.trim() ||
    !worker.email.trim() ||
    !worker.phone.trim() ||
    !worker.role ||
    !worker.stationId;

  return (
    <ModalWrapper>
      <div className="p-2 md:p-4 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X size={24} />
        </button>

        <FormHeader
          title="Add a Worker"
          description="Add workers to your agency"
        />

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <Input
            label="Full Name"
            value={worker.fullName}
            onChangeHandler={(e) =>
              setWorker({ ...worker, fullName: e.target.value })
            }
            error={errors.fullName}
            required
          />
          <Input
            label="Email"
            type="email"
            value={worker.email}
            onChangeHandler={(e) =>
              setWorker({ ...worker, email: e.target.value })
            }
            error={errors.email}
            required
          />

          <div className="flex items-center gap-2">
            <div className="flex-1">
              <Input
                label="Phone Number"
                type="tel"
                value={worker.phone}
                onChangeHandler={(e) =>
                  setWorker({ ...worker, phone: e.target.value })
                }
                error={errors.phone}
                required
              />
            </div>
            <div className="flex-1">
              <Select
                label="Assign a role"
                name="role"
                value={worker.role}
                onChange={(e) => setWorker({ ...worker, role: e.target.value })}
                options={roleOptions}
                placeholder="Select a role"
                error={errors.role}
                required
              />
            </div>
          </div>
          <div>
            <Select
              label="Assign to a station"
              name="stationId"
              value={worker.stationId}
              onChange={(e) =>
                setWorker({ ...worker, stationId: e.target.value })
              }
              options={stationOptions}
              placeholder="Select a station"
              error={errors.stationId}
              required
            />
          </div>
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              onClickHandler={handleSubmit}
              additionalClasses="primaryBtn bg-accent text-white"
              isDisabled={
                loading || isFormIncomplete || Object.keys(errors).length > 0
              }
              loading={loading}
            >
              Add Worker
            </Button>
          </div>
        </form>
      </div>
    </ModalWrapper>
  );
};

export default AddWorkerModal;
