import CustomTable from "../../../components/utility/table/CustomTable";
import { filterBySearch } from "../../../utility/searchUtils";
import { useGetSessionsQuery } from "../gameSessionApi";

// Chip component for displaying counts
const CountChip = ({ value }: { value: number }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
    {value || 0}
  </span>
);

interface GamesHistoryProps {
  searchQuery?: string;
}
const GamesHistory: React.FC<GamesHistoryProps> = ({ searchQuery }) => {
  const { data: gamesHistory } = useGetSessionsQuery("ended");

  const columns = [
    {
      key: "sessionName",
      header: "Session Name",
      type: "simple" as const,
    },
    {
      key: "adminName",
      header: "Admin",
      type: "simple" as const,
    },
    {
      key: "createdAt",
      header: "Created On",
      type: "simple" as const,
    },
    {
      key: "completedOn",
      header: "Completed On",
      type: "simple" as const,
    },
    {
      key: "totalPlayers",
      header: "Players",
      type: "component" as const,
      component: CountChip,
    },
    {
      key: "totalTeams",
      header: "Teams",
      type: "component" as const,
      component: CountChip,
    },
  ];
  const filteredGames = filterBySearch(gamesHistory || [], searchQuery);

  if (!gamesHistory) return null;
  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
      <h1 className="font-bold text-[16px] my-3 text-center sm:text-left">Games History</h1>
      <div className="overflow-x-auto">
      <CustomTable keyField="_id" data={filteredGames} columns={columns} />
      </div>
    </div>
  );
};

export default GamesHistory;
