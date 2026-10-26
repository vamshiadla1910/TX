import React, { useState } from "react";
import {
  Sparkles, Check, ArrowRight, BookOpen, Layers,
  Code2, CheckCircle2, RefreshCw, Save
} from "lucide-react";
import "./AICourseBuilder.css";

export function AICourseBuilder({ onSaveCourse, onNavigate }) {
  const [topic, setTopic] = useState("Autonomous AI Agents & Multi-Agent Orchestration");
  const [level, setLevel] = useState("Advanced");
  const [category, setCategory] = useState("Artificial Intelligence & Systems");
  const [targetAudience, setTargetAudience] = useState("Software Engineers & Full Stack Developers");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSyllabus, setGeneratedSyllabus] = useState(null);
  const [successNotice, setSuccessNotice] = useState("");

  const handleGenerate = () => {
    setIsGenerating(true);
    setSuccessNotice("");

    // Realistic AI simulation with structured output
    setTimeout(() => {
      setGeneratedSyllabus({
        title: topic.trim() || "Autonomous AI Agents & Multi-Agent Orchestration",
        code: "AGENT-AI",
        category,
        level,
        estimatedHours: 52,
        modulesCount: 6,
        modules: [
          {
            num: 1,
            title: "Foundations of Autonomous Agents & LLM Function Calling",
            duration: "8 hours",
            topics: ["Prompt orchestration", "Structured tool calling with JSON Schema", "Memory systems (Short-term & Vector Store)"]
          },
          {
            num: 2,
            title: "LangGraph & State Machine Agent Workflows",
            duration: "10 hours",
            topics: ["Stateful graph topologies", "Cyclic execution loops", "Human-in-the-loop validation checkpoints"]
          },
          {
            num: 3,
            title: "Multi-Agent Collaboration & Role Delegation",
            duration: "10 hours",
            topics: ["Hierarchical supervisor architecture", "Peer-to-peer consensus", "Subagent task distribution"]
          },
          {
            num: 4,
            title: "Real-World Sandboxed Coding & Browser Automation",
            duration: "8 hours",
            topics: ["Dockerized sandbox execution", "Playwright & Chrome DevTools Protocol", "Security sandboxing"]
          },
          {
            num: 5,
            title: "Production Observability & Token Cost Optimization",
            duration: "8 hours",
            topics: ["OpenTelemetry tracing", "Latency mitigation & caching", "Rate limiting & failovers"]
          },
          {
            num: 6,
            title: "Capstone Project: Enterprise AI Coding Assistant",
            duration: "8 hours",
            topics: ["End-to-end repository indexing", "Automated unit test generation", "Pull request self-healing"]
          }
        ]
      });
      setIsGenerating(false);
    }, 1200);
  };

  const handlePublishCourse = () => {
    if (!generatedSyllabus) return;

    const newCourse = {
      id: `crs-ai-${Date.now()}`,
      code: generatedSyllabus.code,
      title: generatedSyllabus.title,
      category: generatedSyllabus.category,
      level: generatedSyllabus.level,
      enrolledLearners: 0,
      completionRate: 0,
      rating: 5.0,
      reviewsCount: 0,
      status: "Published",
      modulesCount: generatedSyllabus.modulesCount,
      totalHours: generatedSyllabus.estimatedHours,
      price: 19999,
      revenue: 0,
      lastUpdated: "Just now",
      thumbnailTone: "purple"
    };

    if (onSaveCourse) {
      onSaveCourse(newCourse);
    }

    setSuccessNotice("Course curriculum generated and published to your catalogue successfully!");
    setTimeout(() => {
      onNavigate("My Courses");
    }, 1400);
  };

  return (
    <div className="ai-builder-container">
      {/* Header */}
      <div className="ai-builder-header">
        <div className="breadcrumb-nav">
          <span>TX Pathwing</span>
          <span className="separator">/</span>
          <span>Instructor</span>
          <span className="separator">/</span>
          <strong className="current">AI Course Builder</strong>
        </div>
        <div className="title-row">
          <div>
            <h1 className="module-title">AI Course Builder</h1>
            <p className="module-sub">
              Generate course syllabi and lab structures with AI.
            </p>
          </div>
          <span className="ai-model-tag">
            <Sparkles size={14} /> AI Powered
          </span>
        </div>
      </div>

      {successNotice && (
        <div className="builder-success-banner">
          <CheckCircle2 size={18} />
          <span>{successNotice}</span>
        </div>
      )}

      {/* Two Column Layout: Generator Inputs on Left, Generated Syllabus on Right */}
      <div className="builder-dual-layout">
        {/* Left Column: Input Form */}
        <div className="card builder-input-card">
          <h3 className="section-heading">Course Specifications</h3>

          <div className="form-group">
            <label>Course Topic / Subject</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Full Stack Microservices with Spring Boot & Docker"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Domain Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="Artificial Intelligence & Systems">Artificial Intelligence</option>
                <option value="Software Development">Software Development</option>
                <option value="Cloud & DevOps">Cloud & DevOps</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="System Design & Architecture">System Design</option>
              </select>
            </div>

            <div className="form-group">
              <label>Target Proficiency</label>
              <select value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="Beginner">Beginner (Foundational)</option>
                <option value="Intermediate">Intermediate (Practitioner)</option>
                <option value="Advanced">Advanced (Expert / Architect)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Target Audience Description</label>
            <input
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g. Senior engineers preparing for cloud architects certification"
            />
          </div>

          <button
            type="button"
            className="btn-generate-ai"
            onClick={handleGenerate}
            disabled={isGenerating || !topic.trim()}
          >
            {isGenerating ? (
              <>
                <RefreshCw size={16} className="spinner" />
                <span>Generating Curriculum with AI...</span>
              </>
            ) : (
              <>
                <Sparkles size={16} />
                <span>Generate Curriculum Outline</span>
              </>
            )}
          </button>
        </div>

        {/* Right Column: Generated Curriculum Preview */}
        <div className="card builder-preview-card">
          <div className="preview-header">
            <div>
              <span className="preview-tag">CURRICULUM SPECIFICATION</span>
              <h3 className="section-heading">
                {generatedSyllabus ? generatedSyllabus.title : "Generated Syllabus Preview"}
              </h3>
            </div>

            {generatedSyllabus && (
              <button
                type="button"
                className="btn-save-course"
                onClick={handlePublishCourse}
              >
                <Save size={16} />
                <span>Publish to My Courses</span>
              </button>
            )}
          </div>

          {!generatedSyllabus ? (
            <div className="preview-placeholder">
              <Sparkles size={36} className="text-purple" />
              <h4>Ready to Architect Your Next Course</h4>
              <p>Configure your course parameters on the left and click "Generate Curriculum Outline" to produce an interactive module breakdown.</p>
            </div>
          ) : (
            <div className="modules-timeline">
              <div className="curriculum-summary-banner">
                <div>
                  <strong>{generatedSyllabus.modulesCount} Core Modules</strong> · {generatedSyllabus.estimatedHours} Total Estimated Hours
                </div>
                <span className="badge success">AI Verified</span>
              </div>

              {generatedSyllabus.modules.map((m) => (
                <div key={m.num} className="module-item">
                  <div className="module-number">0{m.num}</div>
                  <div className="module-content">
                    <div className="module-meta">
                      <strong>Module {m.num}: {m.title}</strong>
                      <small>{m.duration}</small>
                    </div>
                    <ul className="module-topics-list">
                      {m.topics.map((t, idx) => (
                        <li key={idx}>
                          <Check size={12} className="check-icon" /> {t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
