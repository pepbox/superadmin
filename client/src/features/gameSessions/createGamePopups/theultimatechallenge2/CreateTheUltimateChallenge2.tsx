import { useState } from "react";
import { Close } from "@mui/icons-material";
import { GameCreationComponentProps } from "../../components/CreateSessionPopup";
import { CreateGameSessionRequest } from "../../types/sessionTypes";

interface FormData {
  sessionName: string;
  admin: string;
  password: string;
  teamFormationGame: boolean;
}

const initialFormData: FormData = {
  sessionName: "",
  admin: "",
  password: "",
  teamFormationGame: false,
};

const CreateTheUltimateChallenge2: React.FC<GameCreationComponentProps> = ({
  onClose,
  isSubmitting,
  handleCreateSession,
}) => {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const createNewSession = async (sessionData: CreateGameSessionRequest) => {
    try {
      const response = await handleCreateSession(sessionData);
      return response.data;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Special handling for passcode field to allow only 4-digit numeric string
    if (name === "password") {
      const digitOnly = value.replace(/\D/g, "").slice(0, 4); // max 4 digits
      return setFormData((prev) => ({
        ...prev,
        password: digitOnly,
      }));
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sessionData: CreateGameSessionRequest = {
      name: formData.sessionName,
      gameId: "the-ultimate-challenge-2",
      adminName: formData.admin,
      adminPin: formData.password,
      gameConfig: {
        teamFormationGame: formData.teamFormationGame,
        selectedQuestions: {
          1: [],
          2: [],
          3: [],
          4: [],
          5: [],
          6: [],
          7: [],
          8: [],
          9: [],
          10: [],
        },
      },
    };

    try {
      await createNewSession(sessionData);
      setFormData(initialFormData);
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
                Ultimate Team Challenge 2 (new server)
              </h2>
              <h3 className="text-base sm:text-xl font-semibold">
                Create New Session
              </h3>
            </div>
            <button
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
                  name="sessionName"
                  value={formData.sessionName}
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
                    name="admin"
                    value={formData.admin}
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
                    name="password"
                    value={formData.password}
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

export default CreateTheUltimateChallenge2;
