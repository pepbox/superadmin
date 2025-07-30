import { useState } from "react";
import GamesHistory from "../../gameSessions/components/GamesHistory";
import GamesList from "../../gameSessions/components/GamesList";
import LiveGames from "../../gameSessions/components/LiveGames";
import CreateSessionPopup from "../../gameSessions/components/CreateSessionPopup";
import { SessionData } from "../../gameSessions/types/sessionTypes";
import SessionInfoPopup from "../../gameSessions/components/SessionInfoPopup";

interface DashboardMainProps {
  searchQuery?: string;
}
const DashboardMain: React.FC<DashboardMainProps> = ({ searchQuery }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [createSessionOpen, setCreateSessionOpen] = useState(false);
  const handleCreateSession = (gameId: string) => {
    setActiveGame(gameId);
    setCreateSessionOpen(true);
  };
  const [sessionInfoModalOpen, setSessionInfoModalOpen] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);

  const handleShowSessionInfo = (data: SessionData) => {
    setSessionData(data);
    setSessionInfoModalOpen(true);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8">
      {/* Games List Section */}
      <div className="mb-8">
        <GamesList
          handleCreateSession={handleCreateSession}
          searchQuery={searchQuery}
        />
      </div>
      
      {/* Live Games Section */}
      <div className="mb-8">
        <LiveGames
          handleShowSessionInfo={handleShowSessionInfo}
          searchQuery={searchQuery}
        />
      </div>
      
      {/* Games History Section */}
      <div className="mb-8">
        <GamesHistory searchQuery={searchQuery} />
      </div>
      <CreateSessionPopup
        activeGame={activeGame}
        isOpen={createSessionOpen}
        onClose={() => setCreateSessionOpen(false)}
        handleShowSessionInfo={handleShowSessionInfo}
      />
      {sessionData && (
        <SessionInfoPopup
          isOpen={sessionInfoModalOpen}
          onClose={() => setSessionInfoModalOpen(false)}
          sessionData={sessionData}
        />
      )}
    </div>
  );
};

export default DashboardMain;
