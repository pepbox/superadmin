import CreateTeamFormation from "./createGamePopups/teamformation/CreateTeamFormation";
import CreateTheUltimateChallenge from "./createGamePopups/theultimatechallenge/CreateTheUltimateChallenge";

export const games = [
  {
    name: "The Ultimate Challenge",
    id: "the-ultimate-challenge",
    creationPopup: CreateTheUltimateChallenge,
  },
  {
    name: "Team Formation",
    id: "team-formation",
    creationPopup: CreateTeamFormation,
  },
];
