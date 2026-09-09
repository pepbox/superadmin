import { api } from "../../app/api";
import { API_TAGS } from "../../app/apiTags";
import { CreateGameSessionRequest, SessionData } from "./types/sessionTypes";
import { games, getGameDisplayName } from "./gamesConfig";

export const gameSesssionApi = api.injectEndpoints({
  endpoints: (build) => ({
    createSession: build.mutation({
      query: (sessionData: CreateGameSessionRequest) => ({
        url: "/sessions/create",
        method: "POST",
        body: sessionData,
      }),
    }),
    editSession: build.mutation({
      query: (sessionData: {
        sessionId: string;
        sessionName: string;
        adminName: string;
        adminPin: string;
      }) => ({
        url: `/sessions/edit`,
        method: "POST",
        body: sessionData,
      }),
      invalidatesTags: [API_TAGS.SESSIONS],
    }),
    endSession: build.mutation({
      query: (sessionData: {
        sessionId: string;
        password: string;
      }) => ({
        url: `/sessions/end`,
        method: "POST",
        body: sessionData,
      }),
      invalidatesTags: [API_TAGS.SESSIONS],
    }),
    customGameRequest: build.mutation({
      query: (requestData: {
        gameId: string;
        endpoint: string;
        method: string;
        data?: Record<string, any>;
      }) => ({
        url: "/sessions/custom-game-request",
        method: "POST",
        body: requestData,
      }),
    }),
    getSessions: build.query({
      query: (status: "live" | "ended") => ({
        url: "/sessions",
        method: "GET",
        params: { status },
      }),
      transformResponse: (response: { data: any[] }): SessionData[] =>
        response.data.map((session) => {
          const matchedGame = games.find(
            (g) =>
              g.id === session.game?.gameId ||
              (g.id === "scavengerHunt" && session.game?.gameId === "treasureHunt")
          );
          let gameName = matchedGame ? matchedGame.name : session.game?.name;
          gameName = getGameDisplayName(gameName);
          return {
            ...session,
            sessionName: session.name,
            adminName: session.adminName || "Unknown",
            totalPlayers: session.totalPlayers || 0,
            adminPassword: session.adminPin || "",
            totalTeams: session.totalTeams || 0,
            adminGameLink: session.adminLink,
            playerGameLink: session.playerLink,
            game: {
              ...(typeof session.game === "object" ? session.game : {}),
              name: gameName || "The Ultimate Team Challenge",
            },
          };
        }),
      providesTags: [API_TAGS.SESSIONS],

    }),
    fetchAllGames: build.query({
      query: () => ({
        url: "/games/fetch-all",
        method: "GET",
      }),
      transformResponse: (response: { data: any[] }) => response.data,
    }),
  }),
});

export const {
  useCreateSessionMutation,
  useCustomGameRequestMutation,
  useGetSessionsQuery,
  useEditSessionMutation,
  useEndSessionMutation,
  useFetchAllGamesQuery,
} = gameSesssionApi;
