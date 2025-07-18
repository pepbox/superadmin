import { X } from "lucide-react";
import { games } from "../gamesConfig";
import { CreateGameSessionRequest, SessionData } from "../types/sessionTypes";
import { useCreateSessionMutation } from "../gameSessionApi";

interface CreateSessionPopupProps {
  isOpen: boolean;
  onClose: () => void;
  handleShowSessionInfo: (data: SessionData) => void;
  activeGame: string | null;
}

export interface GameCreationComponentProps {
  onClose: () => void;
  isSubmitting: boolean;
  handleCreateSession: (
    sessionData: CreateGameSessionRequest
  ) => Promise<{ data: SessionData }>;
  handleShowSessionInfo: (data: SessionData) => void;
}
const CreateSessionPopup: React.FC<CreateSessionPopupProps> = ({
  isOpen,
  activeGame,
  onClose,
  handleShowSessionInfo,
}) => {
  const [createSession, { isLoading }] = useCreateSessionMutation();

  const GameCreationComponent = games.find(
    (game) => game.id === activeGame
  )?.creationPopup;

  const handleCreateSession = async (
    sessionData: CreateGameSessionRequest
  ): Promise<{ data: SessionData }> => {
    try {
      const response = await createSession(sessionData).unwrap();
      const sessionResponse = response.data;

      const sessionInfo: SessionData = {
        sessionName: sessionResponse.name,
        adminName: sessionResponse.adminName,
        adminPassword: sessionResponse.adminPin,
        playerGameLink: sessionResponse.playerLink,
        adminGameLink: sessionResponse.adminLink,
        totalPlayers: sessionResponse.totalPlayers || 0,
        totalTeams: sessionResponse.totalTeams || 0,
      };
      handleShowSessionInfo(sessionInfo);
      return response;
    } catch (error) {
      console.error("Error creating session:", error);
      throw error;
    }
  };

  if (!isOpen || !GameCreationComponent) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 px-2">
      <div className="relative bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md sm:max-w-xl md:max-w-2xl lg:max-w-3xl">
      <button
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        onClick={onClose}
      >
        <X />
      </button>
      <GameCreationComponent
        onClose={onClose}
        isSubmitting={isLoading}
        handleCreateSession={handleCreateSession}
        handleShowSessionInfo={handleShowSessionInfo}
      />
      </div>
    </div>
  );
};

export default CreateSessionPopup;
