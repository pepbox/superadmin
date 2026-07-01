import CreateTeamFormation from "./createGamePopups/teamformation/CreateTeamFormation";
import CreateTheUltimateChallenge from "./createGamePopups/theultimatechallenge/CreateTheUltimateChallenge";
import CreateGetSetKnow from "./createGamePopups/getsetknow/CreateGetSetKnow";
import CreateGreatestShowdown from "./createGamePopups/greatestShowdown/CreateGreatestShowdown";
import CreateTresureHunt from "./createGamePopups/tresurehunt/CreateTresureHunt";
import CreateBuzzerBattle from "./createGamePopups/buzzerbattle/CreateBuzzerBattle";
import CreateConnections from "./createGamePopups/connections/CreateConnections";

export const games = [
  {
    name: "Ultimate Team Challenge ",
    id: "the-ultimate-challenge",
    creationPopup: CreateTheUltimateChallenge,
    hasLibrary: true,
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
    name: "Connections",
    id: "connections",
    creationPopup: CreateConnections,
  },
  {
    name: "Greatest Showdown",
    id: "greatestShowdown",
    creationPopup: CreateGreatestShowdown,
  },
  {
    name: "Treasure Hunt",
    id: "treasureHunt",
    creationPopup: CreateTresureHunt,
  },
  {
    name: "Buzzer Battle",
    id: "buzzerBattle",
    creationPopup: CreateBuzzerBattle,
    hasLibrary: true,
  }
];
