import { games } from "../gamesConfig";
import { useFetchAllGamesQuery } from "../gameSessionApi";

interface GamesListProps {
  searchQuery?: string;
  handleCreateSession: (gameId: string) => void;
}

const GamesList: React.FC<GamesListProps> = ({
  handleCreateSession,
  searchQuery,
}) => {
  const { data: fetchedGames, isLoading } = useFetchAllGamesQuery(undefined);

  const filteredGames = games.filter((game) =>
    game.name.toLowerCase().includes(searchQuery?.toLowerCase() || "")
  );

  const handleManageGame = (game: (typeof games)[0]) => {
    const isScavengerHunt = game.id === "scavengerHunt" || game.id === "treasureHunt";
    const dbGame = fetchedGames?.find(
      (g: any) => g.gameId === game.id || (isScavengerHunt && g.gameId === "treasureHunt")
    );

    const passcode = import.meta.env.VITE_SUPERADMIN_LIBRARY_PASSCODE || "";

    let frontendUrl = dbGame?.frontendUrl;
    if (!frontendUrl) {
      frontendUrl =
        isScavengerHunt || game.id === "treasureHunt"
          ? "http://localhost:5172"
          : game.id === "buzzerBattle"
          ? "http://localhost:5172"
          : "http://localhost:5174";
    }
    frontendUrl = frontendUrl.replace(/\/$/, "");

    window.open(
      `${frontendUrl}/admin/questions?passcode=${encodeURIComponent(passcode)}`,
      "_blank"
    );
  };

  if (isLoading) {
    return <div>Loading games...</div>;
  }

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
                  className="flex-1 h-[34px] text-xs font-semibold cursor-pointer rounded-[12px] bg-black text-white hover:bg-gray-800 transition-colors duration-200 disabled:opacity-50"
                  onClick={() => handleManageGame(game)}
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
