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
      <h1 className="font-bold text-[16px] my-3">Games</h1>
      <div className="flex flex-wrap gap-4 md:gap-6">
      {filteredGames.map((game, index) => (
        <div
        key={index}
        className="w-full sm:w-[305px] h-[112px] bg-[#8C8C8C1A] rounded-[20px] p-4 flex flex-col justify-between"
        >
        <div>
          <p className="font-bold text-[16px]">{game.name}</p>
        </div>
        <button
          className="w-full h-[34px] cursor-pointer rounded-[12px] border mt-4 hover:bg-gray-100"
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
