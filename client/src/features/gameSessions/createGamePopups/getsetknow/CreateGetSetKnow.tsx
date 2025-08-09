import React, { useState } from "react";
import { GameCreationComponentProps } from "../../components/CreateSessionPopup";

const CreateGetSetKnow: React.FC<GameCreationComponentProps> = ({
  onClose,
  isSubmitting,
  handleCreateSession,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    adminName: "",
    adminPin: "",
    numberOfTeams: 1,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === "adminPin" && value.length > 4) {
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
  ) => {
    e.preventDefault();
    if (!formData.name || !formData.adminName || !formData.adminPin) {
      alert("Please fill in all required fields.");
      return;
    }

    const sessionData = {
      name: formData.name,
      gameId: "getSetKnow",
      adminName: formData.adminName,
      adminPin: formData.adminPin,
      gameConfig: {
        numberOfTeams: formData.numberOfTeams,
        gameLinked: false,
      },
    };

    handleCreateSession(sessionData).then(() => onClose());
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.adminName.trim() !== "" &&
    formData.adminPin.trim() !== "" &&
    formData.numberOfTeams > 0;

  return (
    <div className="w-full max-w-lg mx-auto bg-white rounded-xl p-4 sm:p-8 px-3">
      <div className="flex justify-between items-center mb-6">
        <div className="text-center w-full">
          <h2 className="text-2xl sm:text-3xl font-bold">GetSetKnow</h2>
          <h3 className="text-xl sm:text-2xl font-semibold">
            Create New Session
          </h3>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Session Name*
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Enter session name"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Enter Admin Name*
              </label>
              <input
                type="text"
                name="adminName"
                value={formData.adminName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Admin name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Admin Passcode*
              </label>
              <input
                type="text"
                name="adminPin"
                value={formData.adminPin}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="4-digit code"
                pattern="\d{4}"
                maxLength={4}
                inputMode="numeric"
                required
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium mb-1">
                Number of Teams*
              </label>
              <input
                type="number"
                name="numberOfTeams"
                value={formData.numberOfTeams}
                onChange={handleChange}
                min="1"
                className="w-full px-2 py-2 sm:px-3 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-base"
                required
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between mt-6 gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 transition"
              disabled={!isFormValid}
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateGetSetKnow;
