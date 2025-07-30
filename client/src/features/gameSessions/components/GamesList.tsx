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
            className="h-[112px] bg-[#8C8C8C1A] rounded-[20px] p-4 flex flex-col justify-between hover:shadow-lg transition-shadow duration-200"
          >
            <div>
              <p className="font-bold text-[16px] line-clamp-2">{game.name}</p>
            </div>
            <button
              className="w-full h-[34px] cursor-pointer rounded-[12px] border mt-4 hover:bg-gray-100 transition-colors duration-200"
              onClick={() => handleCreateSession(game.id)}
            >
              Create New Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamesList;
