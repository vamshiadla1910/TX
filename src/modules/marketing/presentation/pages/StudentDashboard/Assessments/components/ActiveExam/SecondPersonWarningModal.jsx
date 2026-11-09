import React from "react";
import { Users, ShieldAlert, PauseCircle, CheckCircle2 } from "lucide-react";

export default function SecondPersonWarningModal({
  faceConfidence = 96,
  onResume
}) {
  return (
    <div className="second-person-overlay" role="alert" aria-live="assertive">
      <div className="second-person-modal-card">
        {/* Pulsing Warning Badge */}
        <div className="second-person-badge">
          <ShieldAlert size={14} />
          <span>PROCTORING VIOLATION &bull; EXAM PAUSED</span>
        </div>

        {/* Warning Icon with pulsating ring */}
        <div className="second-person-icon-wrap">
          <div className="second-person-pulse-ring" />
          <Users size={44} color="#dc2626" />
        </div>

        <h2 className="second-person-heading">Second Person Detected in Camera!</h2>

        <div className="second-person-pause-banner">
          <PauseCircle size={18} />
          <span>The exam timer and answering have been PAUSED</span>
        </div>

        <p className="second-person-description">
          Our AI Proctor detected more than one individual in your webcam feed. Under Pathwing
          proctoring policies, <strong>only the registered test-taker is permitted</strong> in the camera view.
        </p>

        <div className="second-person-instructions-box">
          <div className="instruction-step">
            <span className="step-num">1</span>
            <span>Please request any other person to step completely out of camera view.</span>
          </div>
          <div className="instruction-step">
            <span className="step-num">2</span>
            <span>Ensure you are alone in front of the camera and face forward.</span>
          </div>
          <div className="instruction-step step-highlight">
            <span className="step-num">&check;</span>
            <span>
              <strong>The exam will automatically resume</strong> and continue the moment only one
              person is detected in the frame.
            </span>
          </div>
        </div>

        {/* Live Status Indicator */}
        <div className="second-person-live-status">
          <span className="status-ping-dot" />
          <span>
            Live Proctor Status: Multiple faces detected ({faceConfidence}% confidence) &bull; Awaiting clear frame...
          </span>
        </div>

        {/* Instant Resume Action Button if alone */}
        {onResume && (
          <button
            type="button"
            className="btn-resume-alone"
            onClick={onResume}
          >
            <CheckCircle2 size={16} />
            <span>I am alone &bull; Resume Exam Now</span>
          </button>
        )}
      </div>
    </div>
  );
}
