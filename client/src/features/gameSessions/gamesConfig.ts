import CreateTeamFormation from "./createGamePopups/teamformation/CreateTeamFormation";
import CreateTheUltimateChallenge from "./createGamePopups/theultimatechallenge/CreateTheUltimateChallenge";
import CreateGetSetKnow from "./createGamePopups/getsetknow/CreateGetSetKnow";
import CreateGreatestShowdown from "./createGamePopups/greatestShowdown/CreateGreatestShowdown";

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
  {
    name: "GetSetKnow",
    id: "getSetKnow",
    creationPopup: CreateGetSetKnow,
  },
  {
    name: "Greatest Showdown",
    id: "greatestShowdown",
    creationPopup: CreateGreatestShowdown,
  }
];
