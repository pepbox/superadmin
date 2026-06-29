export interface IGame {
  _id: string;
  name: string;
  gameId: string;
  serverUrl: string;
  frontendUrl?: string;
  endpoints: {
    createSession: string;
    getSession: string;
    updateSession: string;
    deleteSession: string;
    endSession?: string;
  };
}
