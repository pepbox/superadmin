import { useGetSessionsQuery } from "../gameSessionApi";

const GamesStats = () => {
  const { data: liveGames = [] } = useGetSessionsQuery("live");

  return (
    <div>
      <div className="h-[64px] bg-[#B3D7FF] rounded-[16px] my-4 flex items-center">
        <div className="w-[100%] px-4 text-[16px] flex justify-between">
          <p>Live Games</p>
          <p>{liveGames.length}</p>
        </div>
      </div>
      <div className="h-[64px] bg-[#FBF3B9] rounded-[16px] my-4 flex items-center">
        <div className="w-[100%] px-4 text-[16px] flex justify-between">
          <p>Active Players</p>
          <p>
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
