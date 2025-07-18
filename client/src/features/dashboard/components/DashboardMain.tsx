import { useState } from "react";
import GamesHistory from "../../gameSessions/components/GamesHistory";
import GamesList from "../../gameSessions/components/GamesList";
import GamesStats from "../../gameSessions/components/GamesStats";
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
    <div className="flex flex-col lg:flex-row w-full lg:w-[85%] mx-auto px-2">
      <div className="w-full lg:w-[80%] flex flex-col gap-4">
      <GamesList
        handleCreateSession={handleCreateSession}
        searchQuery={searchQuery}
      />
      <LiveGames
        handleShowSessionInfo={handleShowSessionInfo}
        searchQuery={searchQuery}
      />
      <GamesHistory searchQuery={searchQuery} />
      </div>
      <div className="w-full lg:w-[20%] mt-4 lg:mt-0">
      <GamesStats />
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
