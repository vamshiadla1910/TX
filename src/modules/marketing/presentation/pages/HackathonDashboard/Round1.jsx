import React from "react";
import { getRound1Teams, saveRound1Evaluation } from "./HackethonApi";
import { useRoundData } from "./dashboardHelpers";
import RoundView from "./RoundView";
import "./Round1.css";

const Round1 = () => {
  const dataHook = useRoundData(1, getRound1Teams, saveRound1Evaluation, "tx_hackathon_round1_evaluations");
  return <RoundView roundNum={1} title="Round 1 Evaluation" subtitle="Evaluate qualified teams for Round 1" dataHook={dataHook} />;
};

export default Round1;