import { useState } from "react";
import Loader from "../../../components/ui/Loader";
import { useGetSessionsQuery } from "../gameSessionApi";
import { SessionData } from "../types/sessionTypes";
import { filterBySearch } from "../../../utility/searchUtils";
import { Edit2 } from "lucide-react";
import EditSessionPopup from "./EditSessionPopup";
import GamesStats from "./GamesStats";

interface LiveGamesProps {
  searchQuery?: string;
  handleShowSessionInfo: (data: SessionData) => void;
}

const PAGE_SIZE = 6;

const LiveGames: React.FC<LiveGamesProps> = ({
  searchQuery,
  handleShowSessionInfo,
}) => {
  const { data: liveGames, isLoading } = useGetSessionsQuery("live");

  const [editSessionModalOpen, setEditSessionModalOpen] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [copyLink, setCopyLink] = useState<number | null>(null);
  const [page, setPage] = useState(1);

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

  const handleEditSession = (game: SessionData) => {
    setEditSessionModalOpen(true);
    setSessionData(game);
  };

  const filteredGames = filterBySearch(liveGames || [], searchQuery);

  // Pagination logic
  const totalPages = Math.ceil(filteredGames.length / PAGE_SIZE);
  const paginatedGames = filteredGames.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => Math.min(totalPages, p + 1));

  if (isLoading) {
    return <Loader />;
  }
  return (
    <div>
      <h1 className="font-bold text-[16px] my-3">Live Games</h1>
      <GamesStats />
      <div className="flex flex-wrap gap-3 justify-center md:justify-start">
        {paginatedGames &&
          paginatedGames.length > 0 &&
          paginatedGames.map((game: SessionData, index) => (
            <div
              key={index + (page - 1) * PAGE_SIZE}
              className="w-full sm:w-[305px] py-4 bg-[#8C8C8C1A] rounded-[20px] font-sans flex flex-col"
            >
              <div className="flex w-full px-4 justify-between items-center">
                <div className="flex items-center gap-1">
                  <h1 className="font-bold text-base md:text-lg break-words max-w-[180px]">
                    {game.sessionName}
                  </h1>
                  <div
                    onClick={() => handleEditSession(game)}
                    className="flex items-center justify-center hover:bg-gray-200 rounded-full mt-1 cursor-pointer p-2"
                  >
                    <Edit2 size={12} />
                  </div>
                </div>
                <div className="w-[8px] h-[8px] rounded-full bg-[#81DE48]"></div>
              </div>
              <div className="mt-4">
                <div className="flex w-full px-4 justify-between items-center mt-2">
                  <h1 className="text-sm md:text-base">Admin</h1>
                  <div className="text-sm md:text-base">{game.adminName}</div>
                </div>
                <div className="flex w-full px-4 justify-between items-center mt-2">
                  <h1 className="text-sm md:text-base">Players</h1>
                  <div className="text-sm md:text-base">
                    {game.totalPlayers}
                  </div>
                </div>
                <div className="flex w-full px-4 justify-between items-center mt-2">
                  <h1 className="text-sm md:text-base">Teams</h1>
                  <div className="text-sm md:text-base">{game.totalTeams}</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full px-4 mt-3">
                <button
                  onClick={() => handleCopyLink(game.playerGameLink, index)}
                  className="border grow h-[34px] rounded-[12px] cursor-pointer text-sm"
                >
                  {copyLink === index ? "Copied!" : "Copy Link"}
                </button>
                <button
                  onClick={() => handleShowSessionInfo(game)}
                  className="bg-black grow text-white h-[34px] cursor-pointer rounded-[12px] text-sm"
                >
                  View
                </button>
              </div>
            </div>
          ))}
      </div>
      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 cursor-pointer"
          >
            Prev
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={handleNext}
            disabled={page === totalPages}
            className="px-3 py-1 rounded bg-gray-200 disabled:opacity-50 cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
      <EditSessionPopup
        isOpen={editSessionModalOpen}
        sessionData={sessionData}
        onClose={() => setEditSessionModalOpen(false)}
      />
    </div>
  );
};

export default LiveGames;
