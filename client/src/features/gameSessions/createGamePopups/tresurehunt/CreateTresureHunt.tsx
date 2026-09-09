import React, { useState } from "react";
import { Close } from "@mui/icons-material";
import { GameCreationComponentProps } from "../../components/CreateSessionPopup";
import { CreateGameSessionRequest } from "../../types/sessionTypes";

const CreateTresureHunt: React.FC<GameCreationComponentProps> = ({
  onClose,
  isSubmitting,
  handleCreateSession,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    adminName: "",
    adminPin: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Special handling for passcode field to allow only 4-digit numeric string
    if (name === "adminPin") {
      const digitOnly = value.replace(/\D/g, "").slice(0, 4); // max 4 digits
      return setFormData((prev) => ({
        ...prev,
        adminPin: digitOnly,
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name || !formData.adminName || !formData.adminPin) {
      alert("Please fill in all required fields.");
      return;
    }

    const sessionData: CreateGameSessionRequest = {
      name: formData.name,
      gameId: "treasureHunt",
      adminName: formData.adminName,
      adminPin: formData.adminPin,
      gameConfig: {
        numberOfTeams: 1,
        gameLinked: false,
      },
    };

    try {
      await handleCreateSession(sessionData);
      onClose();
    } catch (error: any) {
      console.error("Error creating session:", error);
      alert(error?.message || "Failed to create session. Please try again.");
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-3">
        <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-[600px] mx-auto overflow-y-auto max-h-screen">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <div className="text-center w-full">
              <h2 className="text-lg sm:text-2xl font-bold">
                Scavenger Hunt
              </h2>
              <h3 className="text-base sm:text-xl font-semibold">
                Create New Session
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 ml-2"
            >
              <Close className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-1">
                  Session Name*
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-2 py-2 sm:px-3 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-base"
                  placeholder="Enter session name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">
                    Enter Admin Name*
                  </label>
                  <input
                    type="text"
                    name="adminName"
                    value={formData.adminName}
                    onChange={handleChange}
                    className="w-full px-2 py-2 sm:px-3 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-base"
                    placeholder="Admin name"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-1">
                    Admin Passcode*
                  </label>
                  <input
                    type="text"
                    name="adminPin"
                    value={formData.adminPin}
                    onChange={handleChange}
                    className="w-full px-2 py-2 sm:px-3 sm:py-2 border border-gray-300 rounded-lg text-xs sm:text-base"
                    placeholder="4-digit code"
                    pattern="\d{4}"
                    maxLength={4}
                    inputMode="numeric"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between mt-4 sm:mt-6 gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 sm:px-6 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-xs sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 sm:px-6 sm:py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 text-xs sm:text-base"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Creating..." : "Create"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateTresureHunt;
