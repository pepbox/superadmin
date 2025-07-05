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
      >
        Logout
      </Button>
      {isLogoutDialogOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black/40">
          <div className="flex items-center justify-center h-full">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
              <p>Are you sure you want to logout?</p>
              <div className="mt-4 flex justify-end gap-2">
                <Button
                  variant="outlined"
                  onClick={() => setIsLogoutDialogOpen(false)}
                  sx={{
                    borderRadius: "8px",
                  }}
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
                >
                  {isLoading ? "Logging out..." : "Logout"}
                </Button>
                {error && (
                  <div className="text-red-500 mt-2">
                    {getRTKErrorMessage(error)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LogoutButton;
