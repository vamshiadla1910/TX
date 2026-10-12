import React, { useMemo, useState } from "react";
import ProgressBar from "./RegistrationCards/ProgressBar";
import RegistrationType from "./RegistrationCards/RegistrationType";
import TeamLeadDetails from "./RegistrationCards/TeamLeadDetails";
import TeamMembers from "./RegistrationCards/TeamMembers";
import StudentDetails from "./RegistrationCards/StudentDetails";
import TechnologySkills from "./RegistrationCards/TechnologySkills";
import ChallengeSelection from "./RegistrationCards/ChallengeSelection";
import ProjectIdea from "./RegistrationCards/ProjectIdea";
import Experience from "./RegistrationCards/Experience";
import Institution from "./RegistrationCards/Institution";
import Declaration from "./RegistrationCards/Declaration";
import ReviewSubmit from "./RegistrationCards/ReviewSubmit";
import Success from "./RegistrationCards/Success";
import "./RegistrationForm.css";

const steps = [
  { key: "type", label: "Registration Type" },
  { key: "lead", label: "Team Lead Details" },
  { key: "members", label: "Team Members" },
  { key: "student", label: "Student Details" },
  { key: "technology", label: "Technology & Skills" },
  { key: "challenge", label: "Challenge Selection" },
  { key: "idea", label: "Project Idea" },
  { key: "experience", label: "Experience" },
  { key: "institution", label: "Institution" },
  { key: "declaration", label: "Declaration & Consent" },
  { key: "review", label: "Review & Submit" }
];

const initialData = {
  participantType: "",
  lead: {},
  members: [{}],
  student: {},
  technology: { skills: [] },
  challenge: {},
  idea: {},
  experience: {},
  institution: {},
  declaration: {}
};

export default function RegistrationForm() {
  const [data, setData] = useState(initialData);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [registrationId, setRegistrationId] = useState("");

  const visibleSteps = useMemo(() => {
    if (data.participantType === "individual") {
      return steps.filter(step => !["lead", "members"].includes(step.key));
    }
    return steps.filter(step => step.key !== "student");
  }, [data.participantType]);

  const stepIndex = Math.min(currentStep, visibleSteps.length - 1);
  const currentKey = visibleSteps[stepIndex]?.key;
  const sectionIndexes = Object.fromEntries(visibleSteps.map((step, index) => [step.key, index]));

  const updateSection = (section, values) => {
    setData(prev => ({ ...prev, [section]: { ...prev[section], ...values } }));
  };

  const updateRoot = values => setData(prev => ({ ...prev, ...values }));

  const markCompleteAndNext = () => {
    setCompletedSteps(prev => prev.includes(stepIndex) ? prev : [...prev, stepIndex]);
    if (stepIndex < visibleSteps.length - 1) setCurrentStep(stepIndex + 1);
  };

  const goBack = () => setCurrentStep(prev => Math.max(0, prev - 1));

  const jumpTo = index => {
    if (index <= stepIndex && (index === stepIndex || completedSteps.includes(index))) {
      setCurrentStep(index);
    }
  };

  // Accepts the ID passed from ReviewSubmit
  const submit = (id) => {
    const finalId = id || `TX-REG-${Math.floor(1000 + Math.random() * 9000)}`;
    setRegistrationId(finalId);
    setCompletedSteps(prev => [...new Set([...prev, stepIndex])]);
    setCurrentStep(visibleSteps.length);
  };

  const restart = () => {
    setData(initialData);
    setCurrentStep(0);
    setCompletedSteps([]);
    setRegistrationId("");
  };

  const edit = index => setCurrentStep(index);

  let content;
  if (currentStep >= visibleSteps.length) {
    content = <Success registrationId={registrationId} onRestart={restart} />;
  } else {
    switch (currentKey) {
      case "type":
        content = <RegistrationType data={data} update={updateRoot} onNext={markCompleteAndNext} />;
        break;
      case "lead":
        content = <TeamLeadDetails data={data.lead} update={values => updateSection("lead", values)} onNext={markCompleteAndNext} onBack={goBack} />;
        break;
      case "members":
        content = <TeamMembers data={data} update={updateRoot} onNext={markCompleteAndNext} onBack={goBack} />;
        break;
      case "student":
        content = <StudentDetails data={data.student} update={values => updateSection("student", values)} onNext={markCompleteAndNext} onBack={goBack} />;
        break;
      case "technology":
        content = <TechnologySkills data={data.technology} update={values => updateSection("technology", values)} onNext={markCompleteAndNext} onBack={goBack} />;
        break;
      case "challenge":
        content = <ChallengeSelection data={data.challenge} update={values => updateSection("challenge", values)} onNext={markCompleteAndNext} onBack={goBack} />;
        break;
      case "idea":
        content = <ProjectIdea data={data.idea} update={values => updateSection("idea", values)} onNext={markCompleteAndNext} onBack={goBack} />;
        break;
      case "experience":
        content = <Experience data={data.experience} update={values => updateSection("experience", values)} onNext={markCompleteAndNext} onBack={goBack} />;
        break;
      case "institution":
        content = <Institution data={data.institution} update={values => updateSection("institution", values)} onNext={markCompleteAndNext} onBack={goBack} />;
        break;
      case "declaration":
        content = <Declaration data={data.declaration} update={values => updateSection("declaration", values)} onNext={markCompleteAndNext} onBack={goBack} />;
        break;
      case "review":
        content = <ReviewSubmit data={data} sectionIndexes={sectionIndexes} onBack={goBack} onSubmit={submit} onEdit={edit} />;
        break;
      default:
        content = null;
    }
  }

  return (
    <main className="page">
      <div className="pageHeader">
        <div>
          <span className="eyebrow">TXPathWing Hackathon 2026</span>
          <h1>Complete Your Registration</h1>
          <p>Enter your details section by section and review the complete information before submitting.</p>
        </div>
      </div>

      <ProgressBar
        steps={visibleSteps}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={jumpTo}
      />

      {content}
    </main>
  );
}