export interface SessionData {
  _id?: string;
  playerGameLink: string;
  adminGameLink: string;
  sessionName: string;
  adminName: string;
  adminPassword: string;
  totalPlayers: number;
  totalTeams: number;
}

export interface CreateGameSessionRequest {
  name: string;
  gameId: string;
  adminName: string;
  adminPin: string;
  gameConfig: Record<string, any>;
}
