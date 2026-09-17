import CreateTeamFormation from "./createGamePopups/teamformation/CreateTeamFormation";
import CreateTheUltimateChallenge from "./createGamePopups/theultimatechallenge/CreateTheUltimateChallenge";
import CreateTheUltimateChallenge2 from "./createGamePopups/theultimatechallenge2/CreateTheUltimateChallenge2";
import CreateGetSetKnow from "./createGamePopups/getsetknow/CreateGetSetKnow";
import CreateGetSetKnow2 from "./createGamePopups/getsetknow2/CreateGetSetKnow2";
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
    name: "Ultimate Team Challenge 2",
    id: "the-ultimate-challenge-2",
    creationPopup: CreateTheUltimateChallenge2,
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
    name: "GetSetKnow 2",
    id: "getSetKnow2",
    creationPopup: CreateGetSetKnow2,
  },
  {
    name: "Konnect",
    id: "connections",
    creationPopup: CreateConnections,
  },
  {
    name: "Greatest Showdown",
    id: "greatestShowdown",
    creationPopup: CreateGreatestShowdown,
  },
  {
    name: "Scavenger Hunt",
    id: "treasureHunt",
    creationPopup: CreateTresureHunt,
    hasLibrary: true,
  },
  {
    name: "Buzzer Battle",
    id: "buzzerBattle",
    creationPopup: CreateBuzzerBattle,
    hasLibrary: true,
  }
];

export const getGameDisplayName = (name?: string) => {
  if (!name) return "";
  const normalized = name.trim().toLowerCase();
  if (normalized === "connections" || normalized === "connection") {
    return "Konnect";
  }
  if (
    normalized === "treasure hunt" ||
    normalized === "treasurehunt" ||
    normalized === "tresure hunt" ||
    normalized === "tresurehunt" ||
    normalized === "scavenger hunt" ||
    normalized === "scavengerhunt"
  ) {
    return "Scavenger Hunt";
  }
  return name;
};

