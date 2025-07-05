import { useState } from "react";
import Loader from "../../../components/ui/Loader";
import { useGetSessionsQuery } from "../gameSessionApi";
import { SessionData } from "../types/sessionTypes";
import { filterBySearch } from "../../../utility/searchUtils";

interface LiveGamesProps {
  searchQuery?: string;
  handleShowSessionInfo: (data: SessionData) => void;
}
const LiveGames: React.FC<LiveGamesProps> = ({
  searchQuery,
  handleShowSessionInfo,
}) => {
  const { data: liveGames, isLoading } = useGetSessionsQuery("live");
  const [copyLink, setCopyLink] = useState<number | null>(null);

  const handleCopyLink = (link: string, index: number) => {
    setCopyLink(index);
    navigator.clipboard
      .writeText(link)
      .then(() => {
        console.log("Link copied to clipboard:", link);
      })
      .catch((err) => {
        console.error("Failed to copy link:", err);
      });
  };

  const filteredGames = filterBySearch(liveGames || [], searchQuery);

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <h1 className="font-bold text-[16px] my-3">Live Games</h1>
      <div className="flex gap-3 flex-wrap">
        {filteredGames &&
          filteredGames?.length > 0 &&
          filteredGames.map((game: SessionData, index) => (
            <div className="w-[305px] py-4 bg-[#8C8C8C1A] rounded-[20px] font-sans ">
              <div className="flex w-[100%] px-4 justify-between items-center">
                <div className="flex items-center gap-1">
                  <h1 className="font-bold">{game.sessionName}</h1>

                  {/* <div
                  onClick={() => setEditSessionModalOpen(true)}
                  className="flex items-center justify-center  hover:bg-gray-200 rounded-full mt-1 cursor-pointer p-2 "
                >
                  <Edit2 size={12} className="" />
                </div> */}
                </div>
                <div className="w-[8px] h-[8px] rounded-full bg-[#81DE48]"></div>
              </div>
              <div className="mt-4">
                <div className="flex w-[100%] px-4 justify-between items-center mt-2 ">
                  <h1>Admin</h1>
                  <div className="">{game.adminName}</div>
                </div>
                <div className="flex w-[100%] px-4 justify-between items-center mt-2 ">
                  <h1>Players</h1>
                  <div className="">{game.totalPlayers}</div>
                </div>
                <div className="flex w-[100%] px-4 justify-between items-center mt-2 ">
                  <h1>Teams</h1>
                  <div className="">{game.totalTeams}</div>
                </div>
                {/* <div className='flex w-[100%] px-4 justify-between items-center mt-2 '>
                    <h1>Phase</h1>
                    <div className=''>{Team Naming}</div>
                </div> */}
              </div>
              <div className="flex gap-2 w-[100%] px-4 mt-3">
                <button
                  onClick={() => handleCopyLink(game.playerGameLink, index)}
                  className="border grow h-[34px] rounded-[12px] cursor-pointer"
                >
                  {copyLink === index ? "Copied!" : "Copy Link"}
                </button>
                <button
                  onClick={() => handleShowSessionInfo(game)}
                  className="bg-black grow text-white h-[34px] cursor-pointer rounded-[12px]"
                >
                  View
                </button>
              </div>
              {/* {editSessionModalOpen && (
              <EditSessionPopup
                sessionData={sessionData}
                handleRefresh={handleRefresh}
                sessionId={sessionData.sessionId}
                onClose={() => setEditSessionModalOpen(false)}
              />
            )} */}
            </div>
          ))}
      </div>
    </div>
  );
};

export default LiveGames;
