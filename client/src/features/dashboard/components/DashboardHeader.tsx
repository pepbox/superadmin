import { InputAdornment, styled, TextField } from "@mui/material";
import { SearchIcon } from "lucide-react";
import LogoutButton from "../../auth/components/LogoutButton";
import {
  gameSesssionApi,
  useGetSessionsQuery,
} from "../../gameSessions/gameSessionApi";
import { API_TAGS } from "../../../app/apiTags";
import { useDispatch } from "react-redux";
import { CachedRounded } from "@mui/icons-material";
import { useState, useCallback, memo, useEffect, useRef } from "react";

interface DashboardHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

interface RotatingIconProps {
  rotating: boolean;
}

const RotatingIcon = styled(CachedRounded)<RotatingIconProps>(
  ({ rotating }) => ({
    transition: "transform 0.8s ease-in-out",
    transform: rotating ? "rotate(360deg)" : "rotate(0deg)",
    cursor: "pointer",
    "&:hover": {
      opacity: 0.7,
    },
  })
);

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  searchQuery,
  setSearchQuery,
}) => {
  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { refetch: refetchLive } = useGetSessionsQuery("live");
  const { refetch: refetchEnded } = useGetSessionsQuery("ended");

  // Throttled search effect
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setSearchQuery(localSearchQuery);
    }, 300); // 300ms delay

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [localSearchQuery, setSearchQuery]);

  // Sync local state when external searchQuery changes
  useEffect(() => {
    setLocalSearchQuery(searchQuery);
  }, [searchQuery]);

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      dispatch(gameSesssionApi.util.invalidateTags([API_TAGS.SESSIONS]));
      await Promise.all([refetchLive(), refetchEnded()]);
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch, refetchLive, refetchEnded]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setLocalSearchQuery(event.target.value);
    },
    []
  );

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 h-auto md:h-[60px] py-4 md:py-0">
          {/* Left Side */}
          <div className="flex flex-col md:flex-row gap-4 md:gap-[40px] w-full md:w-auto items-center">
            <div className="flex items-center text-[16px] text-[#111111] py-2">
              <h1 className="text-[20px] md:text-[24px] font-bold">
                Super Admin
              </h1>
            </div>
            {/* Search and Logout in one row for all screens */}
            <div className="flex w-full md:w-auto items-center gap-4">
              <TextField
                value={localSearchQuery}
                onChange={handleSearchChange}
                placeholder="Search"
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: "12px",
                  backgroundColor: "#fff",
                  width: "100%",
                  maxWidth: "250px",
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                    style: {
                      borderRadius: "12px",
                      height: "40px",
                    },
                  },
                }}
                className="w-full md:w-[250px]"
              />
            </div>
          </div>
          {/* Right Side */}
          <div className="flex items-center gap-4 md:gap-[30px] w-full md:w-auto justify-start mt-2 md:mt-0">
            <LogoutButton />
            {/* <h1 className="font-sans text-[16px]">Manage Games</h1> */}
          </div>
        </div>
      </div>
      {/* Sub Header Section */}
      <div className="bg-[#FCA61E]/10 w-full">
        <div className="w-full max-w-[1600px] mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between h-auto md:h-[72px] py-4 md:py-0">
          <div className="w-full md:w-auto flex-1 flex items-center justify-center md:justify-start h-full">
            <h1 className="font-bold text-[18px] md:text-[24px] flex items-center justify-center md:justify-start h-full">
              Game Master Console
            </h1>
          </div>
          <div
            className="mt-2 md:mt-0 ml-0 md:ml-4 cursor-pointer flex-shrink-0 flex items-center justify-center"
            onClick={handleRefresh}
          >
            <RotatingIcon rotating={isRefreshing} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DashboardHeader);
