export interface SessionData {
  _id?: string;
  gameSessionId?: string;
  playerGameLink: string;
  adminGameLink: string;
  adminLink?: string;
  playerLink?: string;
  sessionName: string;
  adminName: string;
  adminPassword: string;
  totalPlayers: number;
  totalTeams: number;
  createdAt?: string;
  game?: {
    _id?: string;
    name?: string;
    gameId?: string;
  };
}

export interface CreateGameSessionRequest {
  name: string;
  gameId: string;
  adminName: string;
  adminPin: string;
  gameConfig: Record<string, any>;
}
