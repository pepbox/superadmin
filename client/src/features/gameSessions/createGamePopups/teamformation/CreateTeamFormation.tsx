import React, { useState } from "react";
import { GameCreationComponentProps } from "../../components/CreateSessionPopup";
import { Close } from "@mui/icons-material";

const CreateTeamFormation: React.FC<GameCreationComponentProps> = ({
  onClose,
  isSubmitting,
  handleCreateSession,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    adminName: "",
    adminPin: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      gameId: "team-formation",
      adminName: formData.adminName,
      adminPin: formData.adminPin,
      gameConfig: {
        gameLinked: false,
      },
    };

    handleCreateSession(sessionData).then(() => onClose());
  };

  const isFormValid =
    formData.name.trim() !== "" &&
    formData.adminName.trim() !== "" &&
    formData.adminPin.trim() !== "";

  return (
    <div>
      {" "}
      <div className="flex justify-between items-center mb-6">
        <div className="text-center w-full">
          <h2 className="text-2xl font-bold">Team Formation</h2>
          <h3 className="text-xl font-semibold">Create New Session</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <Close className="h-6 w-6" />
        </button>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter session name"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Enter Admin Name*
              </label>
              <input
                type="text"
                name="adminName"
                value={formData.adminName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="4-digit code"
                pattern="\d{4}"
                maxLength={4}
                inputMode="numeric"
                required
              />
            </div>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
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

export default CreateTeamFormation;
