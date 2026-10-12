import React from "react";
import { getRound3Teams, saveRound3Evaluation } from "./HackethonApi";
import { useRoundData } from "./dashboardHelpers";
import RoundView from "./RoundView";
import "./Round3.css";

const Round3 = () => {
  const dataHook = useRoundData(3, getRound3Teams, saveRound3Evaluation, "tx_hackathon_round3_evaluations");
  return <RoundView roundNum={3} title="Round 3 Evaluation" subtitle="Evaluate final qualified teams for Round 3" dataHook={dataHook} />;
};

export default Round3;