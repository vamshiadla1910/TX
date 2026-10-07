import React, { useState } from "react";
import {
  Trophy, Medal, Download, Crown,} from "lucide-react";
import "./Reports.css";
// =====================================================
// ROUND TABS
// =====================================================

const roundTabs = [
  "Round 1 Result",
  "Round 2 Result",
  "Round 3 Result",
  "Final Result",
];
// =====================================================
// LEADERBOARD DATA
// =====================================================

const leaderboard = [
  {
    rank: 1,
    registrationid: "tx-reg-2001",
    teamlead: "Harichari",
    projecttitle: "AI Learning Platform",
    score: 27,
    status: "Winner",
  },

  {
    rank: 2,
    registrationid: "tx-reg-2002",
    teamlead: "Rahul Kumar",
    projecttitle: "Smart Healthcare",
    score: 25,
    status: "Runner-up",
  },

  {
    rank: 3,
    registrationid: "tx-reg-2003",
    teamlead: "Priya Sharma",
    projecttitle: "Smart Agriculture",
    score: 17,
    status: "Finalist",
  },

  {
    rank: 4,
    registrationid: "tx-reg-2004",
    teamlead: "Vishnu Bommala",
    projecttitle: "Cybersecurity Assistant",
    score: 17,
    status: "Finalist",
  },

  {
    rank: 5,
    registrationid: "tx-reg-2005",
    teamlead: "Chamathi",
    projecttitle: "AI Marketing Analysis",
    score: 21,
    status: "Finalist",
  },

  {
    rank: 6,
    registrationid: "tx-reg-2006",
    teamlead: "Rosthi",
    projecttitle: "Learning Platform",
    score: 14,
    status: "Eliminated",
  },

  {
    rank: 7,
    registrationid: "tx-reg-2007",
    teamlead: "Likesh",
    projecttitle: "Smart Device",
    score: 13,
    status: "Eliminated",
  },

  {
    rank: 8,
    registrationid: "tx-reg-2008",
    teamlead: "Himubindu",
    projecttitle: "Eliminated AI Healthcare",
    score: 18,
    status: "Eliminated",
  },
];


// =====================================================
// STATUS CSS CLASS
// =====================================================

const statusClassMap = {
  Winner: "status-winner",
  "Runner-up": "status-runner",
  Finalist: "status-finalist",
  "R2 Qualified": "status-r2",
  "R3 Qualified": "status-r3",
  Eliminated: "status-eliminated",
};


// =====================================================
// REPORTS COMPONENT
// =====================================================

const Reports = () => {

  // Currently selected round
  const [activeRound, setActiveRound] = useState("Final Result");


  // ===================================================
  // EXPORT CSV
  // ===================================================

  const handleExportCSV = () => {

    const headers = [
      "Rank",
      "Registration ID",
      "Team Lead",
      "Project Title",
      "Score",
      "Status",
    ];

    const rows = leaderboard.map((team) => [
      team.rank,
      team.registrationid,
      team.teamlead,
      team.projecttitle,
      team.score,
      team.status,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");


    const blob = new Blob(
      [csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );


    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = "hackathon-final-report.csv";

    link.click();

    URL.revokeObjectURL(url);
  };


  // ===================================================
  // COMPONENT UI
  // ===================================================

  return (

    <div className="reports-page">


      {/* =================================================
          REPORT HEADER
      ================================================= */}

      <div className="reports-toolbar">

        <h2 className="reports-header-title">
          Final Reports
        </h2>


        {/* ROUND TABS */}

        <div
          className="reports-tabs"
          aria-label="Reports tabs"
        >

          {roundTabs.map((tab) => (

            <button
              key={tab}
              type="button"

              className={`reports-tab ${
                activeRound === tab
                  ? "reports-tab-active"
                  : ""
              }`}

              onClick={() => setActiveRound(tab)}
            >

              {tab}

            </button>

          ))}

        </div>

      </div>



      {/* =================================================
          REPORT CARD
      ================================================= */}

      <div className="reports-card">


        {/* =================================================
            CARD HEADER
        ================================================= */}

        <div className="reports-card-header">


          <div className="reports-card-title-wrap">


            <div className="reports-card-icon">

              <Trophy size={18} />

            </div>


            <div>

              <h3>
                {activeRound}
              </h3>

              <p>
                Hackathon results and participant details
              </p>

            </div>


          </div>



          {/* EXPORT BUTTON */}

          <button
            type="button"
            className="export-btn"
            onClick={handleExportCSV}
          >

            <Download size={14} />

            Export CSV

          </button>


        </div>



        {/* =================================================
            WINNER / RUNNER-UP / STATS
        ================================================= */}

        <div className="winner-grid">


          {/* =================================================
              WINNER
          ================================================= */}

          <div className="winner-card winner-card-dark">


            <div className="winner-label">

              <Crown size={13} />

              Winner

            </div>


            <div className="winner-name">

              Harichari

            </div>


            <div className="winner-meta">

              AI Learning Platform

            </div>


            <div className="winner-score">

              <span className="winner-score-number">

                27

              </span>


              <span className="winner-score-unit">

                / 30 points

              </span>

            </div>


          </div>



          {/* =================================================
              RUNNER-UP
          ================================================= */}

          <div className="winner-card winner-card-muted">


            <div className="winner-label runner-label">

              <Medal size={13} />

              Runner-up

            </div>


            <div className="winner-name">

              Rahul Kumar

            </div>


            <div className="winner-meta">

              Smart Healthcare

            </div>


            <div className="winner-score">

              <span className="winner-score-number">

                25

              </span>


              <span className="winner-score-unit">

                / 30 points

              </span>

            </div>


          </div>



          {/* =================================================
              FINAL STATS
          ================================================= */}

          <div className="final-stats-card">


            <div className="final-stats-header">

              Final Stats

            </div>


            <div className="final-stats-row">

              <span>
                Total Participants
              </span>

              <strong>
                8
              </strong>

            </div>


            <div className="final-stats-row">

              <span>
                Average Score
              </span>

              <strong>
                19/30
              </strong>

            </div>


            <div className="final-stats-row">

              <span>
                Eliminated
              </span>

              <strong>
                3
              </strong>

            </div>


          </div>


        </div>



        {/* =================================================
            LEADERBOARD TABLE
        ================================================= */}

        <div className="leaderboard-table-wrap">


          <table className="leaderboard-table">


            {/* TABLE HEADER */}

            <thead>

              <tr>

                <th>
                  Rank
                </th>

                <th>
                  Registration ID
                </th>

                <th>
                  Team Lead
                </th>

                <th>
                  Project Title
                </th>

                <th>
                  Score
                </th>

                <th>
                  Status
                </th>

              </tr>

            </thead>



            {/* TABLE BODY */}

            <tbody>


              {leaderboard.map((team) => (

                <tr
                  key={team.registrationid}
                >


                  {/* RANK */}

                  <td className="rank-cell">

                    #{team.rank}

                  </td>



                  {/* REGISTRATION ID */}

                  <td className="team-cell">

                    {team.registrationid}

                  </td>



                  {/* TEAM LEAD */}

                  <td>

                    {team.teamlead}

                  </td>



                  {/* PROJECT TITLE */}

                  <td>

                    {team.projecttitle}

                  </td>



                  {/* SCORE */}

                  <td>

                    {team.score}/30

                  </td>



                  {/* STATUS */}

                  <td>

                    <span
                      className={`status-pill ${
                        statusClassMap[team.status] ||
                        "status-default"
                      }`}
                    >

                      {team.status}

                    </span>

                  </td>


                </tr>

              ))}


            </tbody>


          </table>


        </div>


      </div>


    </div>

  );
};

export default Reports;


{/*
import React from "react";
import { Trophy, Medal, Download, Crown } from "lucide-react";
import "./Reports.css";

const roundTabs = [
  "Round 1 Result",
  "Round 2 Result",
  "Round 3 Result",
  "Final Result"
];

const leaderboard = [
  
  { rank: 1, team: "FinWise / FinTech / AI", score: "9 / 9", total: 27, status: "Winner" },
  { rank: 2, team: "MediChain / Web3 / Health", score: "9 / 8", total: 25, status: "R2 Qualified" },
  { rank: 3, team: "EduVerse / AR / VR", score: "8 / 9", total: 25, status: "R3 Qualified" },
  { rank: 4, team: "Quantum Leap / AI", score: "10 / 7", total: 25, status: "Finalist" },
  { rank: 5, team: "BlockForge / Web3", score: "8 / 7", total: 23, status: "R2 Qualified" },
  { rank: 6, team: "Aquasense / IoT", score: "7 / 7", total: 22, status: "R2 Qualified" },
  { rank: 7, team: "VoiceCraft / NLP", score: "6 / 6", total: 17, status: "Eliminated" },
  { rank: 8, team: "RobotAxis / Robotics / AI", score: "5 / 6", total: 16, status: "Eliminated" }
]

  /*
     { rank: 1, registrationid: tx-reg-2001, teamlead:Harichari,     projecttitle:ailearningplatform,    score: 27, status: "Winner" },
     { rank: 2, registrationid: tx-reg-2002, teamlead:rahulkumar,    projecttitle:smarthealthcare,       score: 25, status: "Winner" },
     { rank: 3, registrationid: tx-reg-2003, teamlead:priyasharma,   projecttitle:smartagriculture,      score: 17, status: "Winner" },
     { rank: 4, registrationid: tx-reg-2004, teamlead:vishnabommala, projecttitle:cybersecurityassistant,score: 17, status: "Winner" },
     { rank: 5, registrationid: tx-reg-2005, teamlead:chamathi,      projecttitle:aimarketinganalysis,   score: 21, status: "Winner" },
     { rank: 6, registrationid: tx-reg-2006, teamlead:rosthi,        projecttitle:learningplatform,      score: 14, status: "Winner" },
     { rank: 7, registrationid: tx-reg-2007, teamlead:likesh,        projecttitle:smartdevice,           score: 13, status: "Winner" },
     { rank: 8, registrationid: tx-reg-2008, teamlead:himubindu,     projecttitle:eliniatedaihealthcare, score: 18, status: "Winner" },
];

const statusClassMap = {
  Winner: "status-winner",
  "R2 Qualified": "status-r2",
  "R3 Qualified": "status-r3",
  Finalist: "status-finalist",
  Eliminated: "status-eliminated"
};

const Reports = () => {
  return (
    <div className="reports-page">
      <div className="reports-toolbar">
        <h2 className="reports-header-title">
           Final Reports 
        </h2>

        <div className="reports-tabs" aria-label="Reports tabs">
          {roundTabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`reports-tab ${index === roundTabs.length - 1 ? "reports-tab-active" : ""}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="reports-card">
        <div className="reports-card-header">
          <div className="reports-card-title-wrap">
            <div className="reports-card-icon">
              <Trophy size={18} />
            </div>
            <div>
              <h3>Final Leaderboard</h3>
              <p>Winner / Runner-up celebration • Export CSV available</p>
            </div>
          </div>

          <button type="button" className="export-btn">
            <Download size={14} />
            Export CSV
          </button>
        </div>

        <div className="winner-grid">
          <div className="winner-card winner-card-dark">
            <div className="winner-label">
              <Crown size={13} />
              Winner
            </div>
            <div className="winner-name">FinWise</div>
            <div className="winner-meta">Siddharth Malhotra • FinTech / AI</div>
            <div className="winner-score">
              <span className="winner-score-number">27</span>
              <span className="winner-score-unit">/ 30 points</span>
            </div>
          </div>

          <div className="winner-card winner-card-muted">
            <div className="winner-label runner-label">
              <Medal size={13} />
              Runner-up
            </div>
            <div className="winner-name">Likesh</div>
            <div className="winner-meta">AR / VR</div>
            <div className="winner-score">
              <span className="winner-score-number">/ 30 points</span>
            </div>
          </div>

          <div className="final-stats-card">
            <div className="final-stats-header">Final Stats</div>
            <div className="final-stats-row">
              <span>Total Finalists</span>
              <strong>3</strong>
            </div>
            <div className="final-stats-row">
              <span>Avg Score</span>
              <strong>22.5/30</strong>
            </div>
            <div className="final-stats-row">
              <span>Eliminated</span>
              <strong>2</strong>
            </div>
          </div>
        </div>

        <div className="leaderboard-table-wrap">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Team</th>
                <th>Scores</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((team) => (
                <tr key={team.rank}>
                  <td className="rank-cell">#{team.rank}</td>
                  <td className="team-cell">{team.team}</td>
                  <td>{team.score}</td>
                  <td>{team.total}</td>
                  <td>
                    <span className={`status-pill ${statusClassMap[team.status] || "status-default"}`}>
                      {team.status}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button type="button" className="action-btn winner-btn">
                      Winner
                    </button>
                    <button type="button" className="action-btn runner-btn">
                      Runner-up
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;

*/}