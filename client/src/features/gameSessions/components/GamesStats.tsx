import { useGetSessionsQuery } from "../gameSessionApi";

const GamesStats = () => {
  const { data: liveGames = [] } = useGetSessionsQuery("live");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="h-20 bg-[#B3D7FF] rounded-2xl flex items-center shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="w-full px-5 text-base flex justify-between items-center">
          <p className="font-medium text-gray-700">Live Games</p>
          <p className="font-bold text-xl text-gray-900">{liveGames.length}</p>
        </div>
      </div>
      <div className="h-20 bg-[#FBF3B9] rounded-2xl flex items-center shadow-sm hover:shadow-md transition-shadow duration-200">
        <div className="w-full px-5 text-base flex justify-between items-center">
          <p className="font-medium text-gray-700">Active Players</p>
          <p className="font-bold text-xl text-gray-900">
            {liveGames.length
              ? liveGames.reduce((a, b) => a + b.totalPlayers, 0)
              : 0}
          </p>
        </div>
      </div>
    </div>
  );
};

export default GamesStats;
