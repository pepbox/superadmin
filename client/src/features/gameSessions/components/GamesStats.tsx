import { useGetSessionsQuery } from "../gameSessionApi";

const GamesStats = () => {
  const { data: liveGames = [] } = useGetSessionsQuery("live");

  return (
    <div className="flex gap-4 mb-4">
      <div className="flex-1 h-16 bg-[#B3D7FF] rounded-2xl flex items-center">
        <div className="w-full px-4 text-base flex justify-between">
          <p className="font-medium">Live Games</p>
          <p className="font-semibold">{liveGames.length}</p>
        </div>
      </div>
      <div className="flex-1 h-16 bg-[#FBF3B9] rounded-2xl flex items-center">
        <div className="w-full px-4 text-base flex justify-between">
          <p className="font-medium">Active Players</p>
          <p className="font-semibold">
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
