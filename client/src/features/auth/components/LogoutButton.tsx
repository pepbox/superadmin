import { Button } from "@mui/material";
import { LogOutIcon } from "lucide-react";
import { useState } from "react";
import { useLogoutMutation } from "../authApi";
import { getRTKErrorMessage } from "../../../utility/getRTKErrorMessage";

const LogoutButton = () => {
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [logout, { isLoading, error }] = useLogoutMutation();

  const handleLogout = () => {
    logout(undefined);
    setIsLogoutDialogOpen(false);
  };
  return (
    <>
      <Button
        variant="outlined"
        onClick={() => setIsLogoutDialogOpen(true)}
        sx={{
          color: "#FF6363",
          borderColor: "#FF6363",
          borderRadius: "8px",
        }}
        startIcon={<LogOutIcon />}
        className="logout-btn"
      >
        <span className="hidden sm:inline">Logout</span>
      </Button>
      {isLogoutDialogOpen && (
        <div className="fixed inset-0 w-full h-full bg-black/40 flex items-center justify-center z-50">
          <div className="w-full max-w-xs sm:max-w-md md:max-w-lg bg-white p-4 sm:p-6 rounded-lg shadow-lg mx-2">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Confirm Logout</h2>
        <p className="text-sm sm:text-base">Are you sure you want to logout?</p>
        <div className="mt-4 flex flex-col sm:flex-row justify-end gap-2">
          <Button
            variant="outlined"
            onClick={() => setIsLogoutDialogOpen(false)}
            sx={{
          borderRadius: "8px",
            }}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleLogout}
            disabled={isLoading}
            sx={{
          borderColor: "#000",
          borderRadius: "8px",
            }}
            className="w-full sm:w-auto"
          >
            {isLoading ? "Logging out..." : "Logout"}
          </Button>
        </div>
        {error && (
          <div className="text-red-500 mt-2 text-sm">
            {getRTKErrorMessage(error)}
          </div>
        )}
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;
