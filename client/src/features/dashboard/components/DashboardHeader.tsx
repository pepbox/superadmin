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

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearchQuery(event.target.value);
  }, []);

  return (
    <div>
      <div className="w-[80%] mx-auto">
        <div className="h-[60px] flex items-center justify-between">
          <div className="flex gap-[40px]">
            <div className="flex items-center text-[16px] text-[#111111]">
              <h1 className="text-[24px] font-bold">Super Admin</h1>
            </div>
            <div>
              <TextField
                value={localSearchQuery}
                onChange={handleSearchChange}
                placeholder="Search"
                variant="outlined"
                size="small"
                sx={{
                  borderRadius: "12px",
                  backgroundColor: "#fff",
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
              />
            </div>
          </div>
          <div className="h-[60px] flex items-center gap-[30px]">
            <h1 className="font-sans text-[16px] font-bold">Home</h1>
            {/* <h1 className="font-sans text-[16px]">Manage Games</h1> */}
            <LogoutButton />
          </div>
        </div>
      </div>
      <div className="bg-[#FCA61E]/10 h-[72px]">
        <div className="w-[80%] h-full mx-auto flex items-center">
          {" "}
          <div className="h-full w-full ">
            <h1 className="h-full font-bold text-[24px] flex items-center justify-center">
              Game Master Console
            </h1>
          </div>
          <div className="ml-4 cursor-pointer" onClick={handleRefresh}>
            <RotatingIcon rotating={isRefreshing} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(DashboardHeader);
