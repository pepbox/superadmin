import { useState, useEffect } from "react";
import { Close } from "@mui/icons-material";
import { SessionData } from "../types/sessionTypes";
import { useEditSessionMutation } from "../gameSessionApi";

interface EditSessionPopupProps {
  isOpen: boolean;
  sessionData: SessionData | null;
  onClose: () => void;
}
const EditSessionPopup: React.FC<EditSessionPopupProps> = ({
  isOpen,
  sessionData,
  onClose,
}) => {
  const [formData, setFormData] = useState({
    sessionName: "",
    admin: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editSession] = useEditSessionMutation();

  console.log("EditSessionPopup sessionData:", sessionData);

  useEffect(() => {
    if (sessionData) {
      setFormData({
        sessionName: sessionData.sessionName || "",
        admin: sessionData.adminName || "",
        password: sessionData.adminPassword || "",
      });
    }
  }, [sessionData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e:
      | React.FormEvent<HTMLFormElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!formData.sessionName || !formData.admin || !formData.password) {
      alert("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    const sessionUpdateData = {
      sessionId: sessionData?._id || "",
      sessionName: formData.sessionName,
      adminName: formData.admin,
      adminPin: formData.password,
    };
    try {
      const response = await editSession(sessionUpdateData).unwrap();
      if (response) {
        onClose();
      }
    } catch (error) {
      console.error("Error updating session:", error);
      alert("Failed to update session. Please try again.");
    }
    try {
    } catch (error) {
      console.error("Error updating session:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !sessionData) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6 w-[80%] max-w-[1152px] mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="text-center w-full">
              <h2 className="text-2xl font-bold">Edit Session</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <Close className="h-6 w-6" />
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Session Name*
            </label>
            <input
              type="text"
              name="sessionName"
              value={formData.sessionName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              placeholder="Enter session name"
              required
            />

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Enter Admin Name*
                </label>
                <input
                  type="text"
                  name="admin"
                  value={formData.admin}
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
                  name="password"
                  value={formData.password}
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
                onClick={handleSubmit}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditSessionPopup;
