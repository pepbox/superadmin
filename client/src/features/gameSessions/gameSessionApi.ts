import { api } from "../../app/api";
import { API_TAGS } from "../../app/apiTags";
import { CreateGameSessionRequest, SessionData } from "./types/sessionTypes";

export const gameSesssionApi = api.injectEndpoints({
  endpoints: (build) => ({
    createSession: build.mutation({
      query: (sessionData: CreateGameSessionRequest) => ({
        url: "/sessions/create",
        method: "POST",
        body: sessionData,
      }),
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
        response.data.map((session) => ({
          ...session,
          sessionName: session.name,
          adminName: session.adminName || "Unknown",
          totalPlayers: session.totalPlayers || 0,
          totalTeams: session.totalTeams || 0,
          adminGameLink: session.adminLink,
          playerGameLink: session.playerLink,
        })),
      providesTags: [API_TAGS.SESSIONS]
    }),
  }),
});

export const {
  useCreateSessionMutation,
  useCustomGameRequestMutation,
  useGetSessionsQuery,
} = gameSesssionApi;
