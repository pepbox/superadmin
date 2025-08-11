import { useState } from "react";
import { Check, Copy, QrCode, Share, X } from "lucide-react";
import QRCode from "qrcode";
import { SessionData } from "../types/sessionTypes";

interface SessionInfoPopupProps {
  sessionData: SessionData;
  isOpen: boolean;
  onClose?: () => void;
}

const SessionInfoPopup: React.FC<SessionInfoPopupProps> = ({
  sessionData,
  isOpen,
  onClose,
}) => {
  const [copiedField, setCopiedField] = useState("");

  const playerLink = sessionData.playerGameLink;
  const adminLink = sessionData.adminGameLink;

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
  };

  const handleShareAll = () => {
    const details = `Session: ${sessionData.sessionName}
                    Admin: ${sessionData.adminName}
                    Player Link: ${playerLink}
                    Admin Link: ${adminLink}
                    ${
                      sessionData.adminPassword &&
                      `Admin Password: ${sessionData.adminPassword}`
                    }`;

    navigator.clipboard.writeText(details);
    setCopiedField("all");
    setTimeout(() => setCopiedField(""), 2000);
  };

  const handleWhatsAppShare = () => {
    const details = `Session: ${sessionData.sessionName}\nAdmin: ${sessionData.adminName}\nPlayer Link: ${playerLink}\nAdmin Link: ${adminLink}\nAdmin Password: ${sessionData.adminPassword}`;
    const encodedDetails = encodeURIComponent(details);
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedDetails}`;
    window.open(whatsappUrl, "_blank");
  };

  const generateCustomQRCode = async (
    link: string,
    type: "admin" | "player"
  ) => {
    try {
      // Generate QR code as a data URL
      const qrDataUrl = await QRCode.toDataURL(link, {
        width: 300,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      // Create a canvas to combine QR code with text
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.error("Failed to get canvas context");
        alert("Failed to generate QR code. Please try again.");
        return;
      }

      const canvasWidth = 400;
      const canvasHeight = 480;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;

      // Fill white background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      // Load the QR code image
      const qrImage = new Image();
      qrImage.onload = () => {
        // Calculate QR code position (centered horizontally, with space for text)
        const qrSize = 300;
        const qrX = (canvasWidth - qrSize) / 2;
        const qrY = 120; // Leave space at top for text

        // Draw QR code
        ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

        // Set text properties
        ctx.textAlign = "center";
        ctx.fillStyle = "#000000";

        // Draw "Admin" or "User" text
        ctx.font = "bold 20px Arial";
        const userTypeText = type === "admin" ? "ADMIN" : "USER";
        ctx.fillText(userTypeText, canvasWidth / 2, 30);

        // Draw "The Ultimate Team Challenge" title
        ctx.font = "bold 24px Arial";
        console.log(sessionData);
        ctx.fillText(sessionData?.game?.name ?? "", canvasWidth / 2, 65);

        // Draw session name
        ctx.font = "bold 18px Arial";
        ctx.fillText(sessionData.sessionName, canvasWidth / 2, 95);

        // Convert canvas to blob and download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const date = new Date().toISOString().split("T")[0];
            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = `${type}-${sessionData.sessionName}-${date}-qr-code.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
          }
        }, "image/png");
      };

      qrImage.src = qrDataUrl;
    } catch (error) {
      console.error("Error generating QR code:", error);
      alert("Failed to generate QR code. Please try again.");
    }
  };

  const handleDownloadQR = async (link: string, type: "player" | "admin") => {
    await generateCustomQRCode(link, type);
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  if (!sessionData || !isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-2 sm:p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[95vh] overflow-y-auto animate-in zoom-in-95 duration-200 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors z-10"
          title="Close"
        >
          <X className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Success Icon and Title */}
        <div className="text-center pt-4 sm:pt-8 pb-4 sm:pb-6 px-4 sm:px-6">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full mb-3 sm:mb-4">
            <div className="bg-green-500 rounded-full p-1.5 sm:p-2">
              <Check className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
            </div>
          </div>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
            Session is live!
          </h2>
        </div>

        {/* Session Information */}
        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <div className="text-center text-gray-600 font-medium mb-4 sm:mb-6 text-sm sm:text-base">
            Session Information
          </div>

          <div className="space-y-4 sm:space-y-6">
            {/* Session Name and Admin Name Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Session Name
                </label>
                <div className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                  {sessionData.sessionName}
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Admin Name
                </label>
                <div className="font-semibold text-gray-900 text-sm sm:text-base break-words">
                  {sessionData.adminName}
                </div>
              </div>
            </div>

            {/* Player Link */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Player Link
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-xs sm:text-sm text-gray-700 break-all">
                  {playerLink}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(playerLink, "player")}
                    className="flex-1 sm:flex-none p-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    title="Copy link"
                  >
                    <Copy className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => handleDownloadQR(playerLink, "player")}
                    className="flex-1 sm:flex-none p-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    title="Download QR code"
                  >
                    <QrCode className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
              {copiedField === "player" && (
                <div className="text-xs text-green-600 mt-1">
                  Copied to clipboard!
                </div>
              )}
            </div>

            {/* Admin Link */}
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                Admin Link
              </label>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                <div className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-3 py-2 text-xs sm:text-sm text-gray-700 break-all">
                  {adminLink}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => copyToClipboard(adminLink, "admin")}
                    className="flex-1 sm:flex-none p-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    title="Copy link"
                  >
                    <Copy className="w-4 h-4 mx-auto" />
                  </button>
                  <button
                    onClick={() => handleDownloadQR(adminLink, "admin")}
                    className="flex-1 sm:flex-none p-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    title="Download QR code"
                  >
                    <QrCode className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
              {copiedField === "admin" && (
                <div className="text-xs text-green-600 mt-1">
                  Copied to clipboard!
                </div>
              )}
            </div>

            {/* Admin Password */}
            {sessionData.adminPassword && (
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                  Admin Passcode*
                </label>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                  <div className="flex-1 bg-gray-50 border border-gray-200 rounded-md px-3 py-2">
                    <div className="font-mono text-base sm:text-lg font-semibold text-gray-900 break-all">
                      {sessionData.adminPassword}
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      copyToClipboard(sessionData.adminPassword, "password")
                    }
                    className="w-full sm:w-auto p-2 text-gray-500 hover:text-gray-700 border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                    title="Copy passcode"
                  >
                    <Copy className="w-4 h-4 mx-auto" />
                  </button>
                </div>
                {copiedField === "password" && (
                  <div className="text-xs text-green-600 mt-1">
                    Copied to clipboard!
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-2">
                  Use this passcode to access admin panel
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6 sm:mt-8">
            <button
              onClick={handleShareAll}
              className="flex-1 bg-gray-900 text-white py-2.5 px-4 rounded-md font-medium hover:bg-gray-800 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <Share className="w-4 h-4" />
              <span>Copy All Details</span>
            </button>
            <button
              onClick={handleWhatsAppShare}
              className="flex-1 bg-green-600 text-white py-2.5 px-4 rounded-md font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.134.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.074-.149-.669-.816-.911-1.114-.242-.297-.487-.454-.669-.454h-.57c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.231-.374a9.873 9.873 0 01-1.51-5.26 9.897 9.897 0 019.996-9.781 9.838 9.838 0 017.081 3.192 9.862 9.862 0 012.708 6.597 9.885 9.885 0 01-9.946 9.832m8.142-18.655A11.945 11.945 0 0012.051 0C5.436 0 .058 5.396.058 12.032a12.008 12.008 0 001.713 6.191L0 24l5.862-1.545a11.977 11.977 0 005.189 1.192h.005c6.627 0 12.004-5.396 12.004-12.032a11.921 11.921 0 00-3.537-8.495z" />
              </svg>
              <span className="hidden sm:inline">Share on WhatsApp</span>
              <span className="sm:hidden">WhatsApp</span>
            </button>
          </div>

          {copiedField === "all" && (
            <div className="text-center text-xs sm:text-sm text-green-600 mt-2">
              All details copied to clipboard!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionInfoPopup;
