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
  const [createSession] = useCreateSessionMutation();

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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40">
      <div className="bg-white p-6 rounded-lg shadow-lg min-w-[50vw]">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <X />
        </button>
        <GameCreationComponent
          onClose={onClose}
          handleCreateSession={handleCreateSession}
          handleShowSessionInfo={handleShowSessionInfo}
        />
      </div>
    </div>
  );
};

export default CreateSessionPopup;
