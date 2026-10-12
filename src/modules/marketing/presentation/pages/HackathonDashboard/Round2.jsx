import React from "react";
import { getRound2Teams, saveRound2Evaluation } from "./HackethonApi";
import { useRoundData } from "./dashboardHelpers";
import RoundView from "./RoundView";
import "./Round2.css";

const Round2 = () => {
  const dataHook = useRoundData(2, getRound2Teams, saveRound2Evaluation, "tx_hackathon_round2_evaluations");
  return <RoundView roundNum={2} title="Round 2 Evaluation" subtitle="Evaluate qualified teams for Round 2" dataHook={dataHook} />;
};

export default Round2;