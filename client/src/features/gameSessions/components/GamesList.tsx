import { games } from "../gamesConfig";

interface GamesListProps {
  searchQuery?: string;
  handleCreateSession: (gameId: string) => void;
}
const GamesList: React.FC<GamesListProps> = ({
  handleCreateSession,
  searchQuery,
}) => {
  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchQuery?.toLowerCase() || "")
  );
  return (
    <div>
      <h1 className="font-bold text-[18px] mb-6">Games</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 lg:gap-6">
        {filteredGames.map((game, index) => (
          <div
            key={index}
            className="h-[120px] bg-[#8C8C8C1A] rounded-[20px] p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200"
          >
            <div>
              <p className="font-bold text-[16px] line-clamp-1">{game.name}</p>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                className="flex-1 h-[34px] text-xs font-semibold cursor-pointer rounded-[12px] border hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleCreateSession(game.id)}
              >
                Create Session
              </button>
              {game.hasLibrary && (
                <button
                  className="flex-1 h-[34px] text-xs font-semibold cursor-pointer rounded-[12px] bg-black text-white hover:bg-gray-800 transition-colors duration-200"
                  onClick={() => {
                    let frontendUrl = import.meta.env.VITE_THE_ULTIMATE_CHALLENGE_FRONTEND_URL || "http://localhost:5174";
                    if (game.id === "buzzerBattle") {
                      frontendUrl = import.meta.env.VITE_BUZZER_BATTLE_FRONTEND_URL || "http://localhost:5172";
                    }
                    const passcode = import.meta.env.VITE_SUPERADMIN_LIBRARY_PASSCODE || "pepbox-superadmin-secret-library-passcode-2026";
                    window.open(`${frontendUrl}/admin/questions?passcode=${encodeURIComponent(passcode)}`, "_blank");
                  }}
                >
                  Manage Game
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesList;
