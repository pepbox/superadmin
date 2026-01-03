import { useState } from "react";
import { Close } from "@mui/icons-material";
import { SessionData } from "../types/sessionTypes";
import { useEndSessionMutation } from "../gameSessionApi";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { getRTKErrorMessage } from "../../../utility/getRTKErrorMessage";

interface EndSessionModalProps {
  isOpen: boolean;
  sessionData: SessionData | null;
  onClose: () => void;
}

const EndSessionModal: React.FC<EndSessionModalProps> = ({
  isOpen,
  sessionData,
  onClose,
}) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [endSession] = useEndSessionMutation();

  const handleSubmit = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    if (!password) {
      setError("Please enter your password.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await endSession({
        sessionId: sessionData?._id || "",
        password: password,
      }).unwrap();

      if (response) {
        // Clear form and close modal
        setPassword("");
        onClose();
      }
    } catch (err: any) {
      const errorMessage = getRTKErrorMessage(err);
      setError(errorMessage || "Failed to end session. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setPassword("");
    setError("");
    onClose();
  };

  if (!isOpen || !sessionData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-[500px] mx-auto shadow-xl">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-gray-900">End Session</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Close className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">

          <div className="space-y-2 mb-4">
            <p className="text-sm text-gray-700">
              <strong>Session:</strong> {sessionData.sessionName}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Game:</strong> {sessionData?.game?.name}
            </p>
            <p className="text-sm text-gray-700">
              <strong>Players:</strong> {sessionData.totalPlayers}
            </p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Enter Your SuperAdmin Password to Confirm
            </label>
            <div className="relative">
              <input type="email" className="hidden" autoComplete="username"/>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter your password"
                autoFocus
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                disabled={isSubmitting}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {error && (
              <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4" />
                {error}
              </p>
            )}
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            disabled={isSubmitting || !password}
          >
            {isSubmitting ? "Ending Session..." : "End Session"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EndSessionModal;

