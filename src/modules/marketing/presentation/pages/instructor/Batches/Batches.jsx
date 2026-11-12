import { useState, useMemo, useEffect } from "react";
import {
  Users,
  Calendar,
  Clock,
  Plus,
  Search,
  CheckCircle,
  ChevronRight,
  ChevronDown,
  X,
  BookOpen,
  Layers,
  Sparkles,
  Grid,
  FolderKanban,
  AlertCircle,
  CheckCircle2,
  Trash2,
  Edit3,
  Save,
  Briefcase
} from "lucide-react";
import { Badge } from "../common/Badge";
import { ActionButton, IconButton } from "../common/ActionButton.jsx";
import "./Batches.css";

// Helper function to resolve category from course name
export function getCategoryForCourse(courseTitle = "") {
  const map = {
    "Java Full Stack Development": "Software Development",
    "AWS DevOps Engineer Professional": "Cloud & DevOps",
    "AWS DevOps Spring Intensive 2027": "Cloud & DevOps",
    "React 19 & Next.js Full Stack Engineering": "Web Development",
    "Distributed Microservices & Kubernetes Architecture": "System Architecture"
  };

  if (map[courseTitle]) return map[courseTitle];

  const lower = (courseTitle || "").toLowerCase();
  if (lower.includes("aws") || lower.includes("cloud") || lower.includes("devops") || lower.includes("azure")) {
    return "Cloud & DevOps";
  }
  if (lower.includes("react") || lower.includes("next") || lower.includes("web") || lower.includes("frontend")) {
    return "Web Development";
  }
  if (lower.includes("java") || lower.includes("python") || lower.includes("spring") || lower.includes("backend") || lower.includes("software")) {
    return "Software Development";
  }
  if (lower.includes("microservice") || lower.includes("kubernetes") || lower.includes("architecture") || lower.includes("system")) {
    return "System Architecture";
  }
  if (lower.includes("ai") || lower.includes("data") || lower.includes("ml") || lower.includes("machine")) {
    return "AI & Data Science";
  }
  return "Software Development";
}

// Category styling configuration
const CATEGORY_META = {
  "Cloud & DevOps": { icon: "☁️", tone: "blue", accentClass: "cat-cloud" },
  "Software Development": { icon: "☕", tone: "green", accentClass: "cat-software" },
  "Web Development": { icon: "⚛️", tone: "purple", accentClass: "cat-web" },
  "System Architecture": { icon: "⚡", tone: "amber", accentClass: "cat-system" },
  "AI & Data Science": { icon: "🤖", tone: "blue", accentClass: "cat-cloud" },
  "General": { icon: "📁", tone: "blue", accentClass: "cat-cloud" }
};

export function Batches({
  batches = [],
  onAddBatch,
  onDeleteBatch,
  onUpdateBatch,
  courses = [],
  onNavigate
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState("grouped"); // "grouped" by category or "grid"
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [formError, setFormError] = useState("");

  // Edit batch state within manage modal
  const [editMode, setEditMode] = useState(false);
  const [editEnrolled, setEditEnrolled] = useState(0);
  const [editCapacity, setEditCapacity] = useState(100);
  const [editCompletion, setEditCompletion] = useState(0);
  const [editSchedule, setEditSchedule] = useState("");
  const [editStatus, setEditStatus] = useState("Active");

  // Form state initialized exactly to match the user's uploaded image
  const [newBatchName, setNewBatchName] = useState("");
  const [newCourseName, setNewCourseName] = useState("Java Full Stack Development");
  const [newSchedule, setNewSchedule] = useState("Mon, Wed, Fri · 6:00 PM – 8:00 PM");
  const [newCapacity, setNewCapacity] = useState("120");

  // Available course titles for select dropdown
  const availableCourses = useMemo(() => {
    const list = [
      "Java Full Stack Development",
      "AWS DevOps Engineer Professional",
      "React 19 & Next.js Full Stack Engineering",
      "Distributed Microservices & Kubernetes Architecture"
    ];
    if (courses && courses.length > 0) {
      courses.forEach((c) => {
        const title = c.title || c.name;
        if (title && !list.includes(title)) {
          list.push(title);
        }
      });
    }
    return list;
  }, [courses]);

  // Ensure each batch has its category resolved and prevent duplicates
  const processedBatches = useMemo(() => {
    const uniqueMap = new Map();
    batches.forEach((b) => {
      if (!b || !b.id) return;
      const key = (b.name || "").trim().toLowerCase();
      if (!uniqueMap.has(key)) {
        const category = b.category || getCategoryForCourse(b.courseName);
        uniqueMap.set(key, { ...b, category });
      }
    });
    return Array.from(uniqueMap.values());
  }, [batches]);

  // Extract unique categories strictly from user-entered batches
  const categoriesList = useMemo(() => {
    const set = new Set();
    processedBatches.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [processedBatches]);

  // Filtered batches based on search, status, and category
  const filteredBatches = useMemo(() => {
    return processedBatches.filter((b) => {
      const query = search.trim().toLowerCase();
      const matchSearch =
        !query ||
        (b.name + " " + b.courseName + " " + (b.code || "") + " " + (b.category || ""))
          .toLowerCase()
          .includes(query);
      const matchStatus = statusFilter === "All" || b.status === statusFilter;
      const matchCategory = selectedCategory === "All" || b.category === selectedCategory;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [processedBatches, search, statusFilter, selectedCategory]);

  // Group filtered batches by category for "grouped" view mode
  const groupedBatches = useMemo(() => {
    const groups = {};
    filteredBatches.forEach((b) => {
      const cat = b.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(b);
    });
    return groups;
  }, [filteredBatches]);

  // =========================================================================
  // DYNAMIC KPIS: Calculated strictly from user-entered batches
  // =========================================================================
  const activeCount = processedBatches.filter((b) => b.status === "Active").length;
  const totalEnrolled = processedBatches.reduce((sum, b) => sum + (Number(b.enrolled) || 0), 0);
  const totalCapacity = processedBatches.reduce((sum, b) => sum + (Number(b.capacity) || 0), 0);
  const overallFill = totalCapacity > 0 ? Math.round((totalEnrolled / totalCapacity) * 100) : 0;
  const avgProgress = processedBatches.length > 0
    ? Math.round(
        processedBatches.reduce((sum, b) => sum + (Number(b.completion) || 0), 0) /
          processedBatches.length
      )
    : 0;
  const totalCategories = categoriesList.length;

  // Auto-dismiss toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // When opening a batch to manage, populate edit state
  useEffect(() => {
    if (selectedBatch) {
      setEditEnrolled(selectedBatch.enrolled || 0);
      setEditCapacity(selectedBatch.capacity || 100);
      setEditCompletion(selectedBatch.completion || 0);
      setEditSchedule(selectedBatch.schedule || "");
      setEditStatus(selectedBatch.status || "Active");
      setEditMode(false);
    }
  }, [selectedBatch]);

  // Handle form submission: "Publish Batch"
  const handleCreateSubmit = (e) => {
    e.preventDefault();
    const trimmedName = newBatchName.trim();
    if (!trimmedName) {
      setFormError("Please enter a Batch Name.");
      return;
    }

    // DUPLICATE CHECK: Ensure no duplicate batch name is stored
    const isDuplicate = processedBatches.some(
      (b) => b.name.trim().toLowerCase() === trimmedName.toLowerCase()
    );
    if (isDuplicate) {
      setFormError(`A batch named "${trimmedName}" already exists. Duplicate batches are not stored.`);
      return;
    }

    setFormError("");

    const category = getCategoryForCourse(newCourseName);

    // Generate intelligent, non-colliding batch code
    const initials = newCourseName
      .split(" ")
      .filter((w) => !["and", "&", "in", "the", "for", "of"].includes(w.toLowerCase()))
      .map((w) => w[0].toUpperCase())
      .slice(0, 3)
      .join("");
    const yearMatch = trimmedName.match(/20\d{2}/);
    const year = yearMatch ? yearMatch[0].slice(-2) : "27";

    let codeCandidate = `${initials || "BAT"}-${year}A`;
    let letterIndex = 0;
    while (processedBatches.some((b) => b.code === codeCandidate)) {
      letterIndex++;
      codeCandidate = `${initials || "BAT"}-${year}${String.fromCharCode(65 + letterIndex)}`;
    }

    const newBatchItem = {
      id: `batch-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      name: trimmedName,
      code: codeCandidate,
      courseId: `crs-${Date.now()}`,
      courseName: newCourseName,
      category: category,
      schedule: newSchedule.trim() || "Mon, Wed, Fri · 6:00 PM – 8:00 PM",
      enrolled: 0,
      capacity: Number(newCapacity) || 120,
      startDate: "Starts Nov 2026",
      endDate: "Ends Feb 2027",
      status: "Active",
      completion: 0,
      createdAt: new Date().toISOString()
    };

    if (onAddBatch) {
      onAddBatch(newBatchItem);
    }

    // Reset fields to image defaults
    setNewBatchName("");
    setNewCourseName("Java Full Stack Development");
    setNewSchedule("Mon, Wed, Fri · 6:00 PM – 8:00 PM");
    setNewCapacity("120");
    setShowCreateModal(false);

    // Set success toast
    setToastMessage(`✓ Batch "${newBatchItem.name}" successfully created and saved in category "${category}"!`);

    // Reset category filter if it was filtered to something else
    if (selectedCategory !== "All" && selectedCategory !== category) {
      setSelectedCategory("All");
    }
  };

  // Save changes to an existing batch
  const handleSaveBatchEdits = () => {
    if (!selectedBatch) return;
    const updated = {
      ...selectedBatch,
      enrolled: Number(editEnrolled) || 0,
      capacity: Number(editCapacity) || 100,
      completion: Number(editCompletion) || 0,
      schedule: editSchedule.trim() || selectedBatch.schedule,
      status: editStatus
    };

    if (onUpdateBatch) {
      onUpdateBatch(updated);
    }
    setSelectedBatch(updated);
    setEditMode(false);
    setToastMessage(`Updated details for batch "${updated.name}"!`);
  };

  // Delete batch
  const handleDelete = (batchId, batchName) => {
    if (window.confirm(`Are you sure you want to delete "${batchName}"?`)) {
      if (onDeleteBatch) {
        onDeleteBatch(batchId);
      }
      if (selectedBatch && selectedBatch.id === batchId) {
        setSelectedBatch(null);
      }
      setToastMessage(`Deleted batch "${batchName}".`);
    }
  };

  return (
    <div className="batches-container">
      {/* Top Header Row */}
      <div className="batches-header-row">
        <div className="batches-header-info">
          <div className="breadcrumb-nav">
            <span>TX Pathwing</span>
            <span>/</span>
            <span>Instructor</span>
            <span>/</span>
            <strong className="current">Batches</strong>
          </div>
          <h1 className="module-title">Batches</h1>
          <p className="module-sub">
            Track active batches, capacity allocations, and live schedule calendars categorized by course discipline.
          </p>
        </div>
        <button
          type="button"
          className="btn-create-cohort-top"
          onClick={() => {
            setFormError("");
            setShowCreateModal(true);
          }}
        >
          <Plus size={16} />
          <span>Create New Batch</span>
        </button>
      </div>

      {/* Success Toast Banner */}
      {toastMessage && (
        <div className="batch-toast-banner" role="status">
          <div className="batch-toast-left">
            <CheckCircle2 size={18} />
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            className="batch-toast-close"
            onClick={() => setToastMessage(null)}
            aria-label="Dismiss message"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* KPI Metrics Row: Strictly derived from user-entered batches */}
      <div className="batches-metrics-grid">
        <div className="batch-metric-box">
          <div className="metric-info">
            <span className="metric-label">ACTIVE BATCHES</span>
            <strong className="metric-val">{activeCount}</strong>
            <span className="metric-note">
              {activeCount > 0 ? "● Real-time batches running" : "● No active batches running"}
            </span>
          </div>
          <div className="metric-icon-wrap blue">
            <Layers size={22} />
          </div>
        </div>

        <div className="batch-metric-box">
          <div className="metric-info">
            <span className="metric-label">TOTAL ENROLLED</span>
            <strong className="metric-val">{totalEnrolled}</strong>
            <span className="metric-note">▲ {overallFill}% capacity fill rate</span>
          </div>
          <div className="metric-icon-wrap green">
            <Users size={22} />
          </div>
        </div>

        <div className="batch-metric-box">
          <div className="metric-info">
            <span className="metric-label">AVERAGE PROGRESS</span>
            <strong className="metric-val">{avgProgress}%</strong>
            <span className="metric-note">Above platform benchmark</span>
          </div>
          <div className="metric-icon-wrap purple">
            <CheckCircle size={22} />
          </div>
        </div>

        <div className="batch-metric-box">
          <div className="metric-info">
            <span className="metric-label">CATEGORIES</span>
            <strong className="metric-val">{totalCategories}</strong>
            <span className="metric-note">Curriculum disciplines</span>
          </div>
          <div className="metric-icon-wrap amber">
            <FolderKanban size={22} />
          </div>
        </div>
      </div>

      {/* Search, Status & View Controls */}
      <div className="batches-filter-wrapper">
        <div className="filter-top-row">
          <div className="batches-search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search batch title, code, course, or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-controls-right">
            <div className="status-chips-group">
              {["All", "Active", "Upcoming"].map((st) => (
                <button
                  key={st}
                  type="button"
                  className={`status-btn ${statusFilter === st ? "active" : ""}`}
                  onClick={() => setStatusFilter(st)}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className="view-mode-toggle" title="Switch layout format">
              <button
                type="button"
                className={`view-mode-btn ${viewMode === "grouped" ? "active" : ""}`}
                onClick={() => setViewMode("grouped")}
              >
                <FolderKanban size={13} />
                <span>By Category</span>
              </button>
              <button
                type="button"
                className={`view-mode-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
              >
                <Grid size={13} />
                <span>All Grid</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Filter Chips Bar */}
        <div className="category-filter-row" aria-label="Filter batches by category">
          <button
            type="button"
            className={`category-filter-chip ${selectedCategory === "All" ? "active" : ""}`}
            onClick={() => setSelectedCategory("All")}
          >
            <span>All Disciplines</span>
            <span className="category-chip-count">{processedBatches.length}</span>
          </button>
          {categoriesList.map((cat) => {
            const count = processedBatches.filter((b) => b.category === cat).length;
            const meta = CATEGORY_META[cat] || CATEGORY_META["General"];
            return (
              <button
                key={cat}
                type="button"
                className={`category-filter-chip ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                <span>{meta.icon}</span>
                <span>{cat}</span>
                <span className="category-chip-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Batches Display Area */}
      {filteredBatches.length === 0 ? (
        <div className="cohorts-empty-box">
          <Layers size={44} color="#94a3b8" />
          <h3>
            {processedBatches.length === 0
              ? "No Batches Created Yet"
              : "No Batches Match Your Search Filter"}
          </h3>
          <p>
            {processedBatches.length === 0
              ? "You have not created any batches yet. Click the button below to launch your first batch. All metrics and categories will automatically calculate based on the data you enter."
              : "Try adjusting your search query, status chip, or category filter to view other batches."}
          </p>
          <button
            type="button"
            className="btn-create-cohort-top"
            onClick={() => {
              setSearch("");
              setStatusFilter("All");
              setSelectedCategory("All");
              setFormError("");
              setShowCreateModal(true);
            }}
          >
            <Plus size={16} />
            <span>Create New Batch</span>
          </button>
        </div>
      ) : viewMode === "grouped" ? (
        /* Grouped by Category View */
        Object.entries(groupedBatches).map(([category, catBatches]) => {
          const meta = CATEGORY_META[category] || CATEGORY_META["General"];
          return (
            <div key={category} className="category-section-block">
              <div className="category-section-banner">
                <div className="category-banner-left">
                  <span className="category-banner-icon">{meta.icon}</span>
                  <h2 className="category-banner-title">{category}</h2>
                </div>
                <span className="category-banner-badge">
                  {catBatches.length} {catBatches.length === 1 ? "Batch" : "Batches"}
                </span>
              </div>

              <div className="cohorts-grid-layout">
                {catBatches.map((batch) =>
                  renderBatchCard(batch, setSelectedBatch, handleDelete)
                )}
              </div>
            </div>
          );
        })
      ) : (
        /* Flat Grid View */
        <div className="cohorts-grid-layout">
          {filteredBatches.map((batch) =>
            renderBatchCard(batch, setSelectedBatch, handleDelete)
          )}
        </div>
      )}

      {/* ==========================================================================
          MODAL FORM: Exact Pixel-Perfect Match for the Uploaded Image
          (media_1794305414270_fc2812e7.png)
          ========================================================================== */}
      {showCreateModal && (
        <div
          className="cohort-modal-overlay"
          onClick={() => setShowCreateModal(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="cohort-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Title and Close button matching image */}
            <div className="cohort-modal-header">
              <h2 className="cohort-modal-title">Create New Batch</h2>
              <button
                type="button"
                className="cohort-modal-close-btn"
                onClick={() => setShowCreateModal(false)}
                aria-label="Close dialog"
              >
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#b91c1c",
                  borderRadius: "8px",
                  fontSize: "13px",
                  marginBottom: "14px"
                }}
              >
                <AlertCircle size={16} />
                <span>{formError}</span>
              </div>
            )}

            {/* Form Fields matching image */}
            <form className="cohort-modal-form" onSubmit={handleCreateSubmit}>
              {/* Field 1: Batch Name */}
              <div className="cohort-form-group">
                <label className="cohort-form-label">Batch Name</label>
                <input
                  type="text"
                  className="cohort-form-input"
                  placeholder="e.g. AWS DevOps Spring Intensive 2027"
                  value={newBatchName}
                  onChange={(e) => {
                    setNewBatchName(e.target.value);
                    if (formError) setFormError("");
                  }}
                  autoFocus
                  required
                />
              </div>

              {/* Field 2: Associated Course */}
              <div className="cohort-form-group">
                <label className="cohort-form-label">Associated Course</label>
                <div className="cohort-select-wrapper">
                  <select
                    className="cohort-form-select"
                    value={newCourseName}
                    onChange={(e) => setNewCourseName(e.target.value)}
                  >
                    {availableCourses.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <div className="cohort-select-arrow">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              {/* Field 3: Weekly Schedule */}
              <div className="cohort-form-group">
                <label className="cohort-form-label">Weekly Schedule</label>
                <input
                  type="text"
                  className="cohort-form-input"
                  placeholder="Mon, Wed, Fri · 6:00 PM – 8:00 PM"
                  value={newSchedule}
                  onChange={(e) => setNewSchedule(e.target.value)}
                />
              </div>

              {/* Field 4: Student Capacity */}
              <div className="cohort-form-group">
                <label className="cohort-form-label">Student Capacity</label>
                <input
                  type="number"
                  className="cohort-form-input"
                  min="1"
                  max="1000"
                  placeholder="120"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                />
              </div>

              {/* Footer Buttons: Cancel and Publish Batch */}
              <div className="cohort-modal-footer">
                <button
                  type="button"
                  className="btn-modal-cancel"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-modal-publish">
                  Publish Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Detail & Management Modal */}
      {selectedBatch && (
        <div
          className="cohort-modal-overlay"
          onClick={() => {
            setSelectedBatch(null);
            setEditMode(false);
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="cohort-modal-card"
            onClick={(e) => e.stopPropagation()}
            style={{ width: "min(580px, 100%)" }}
          >
            <div className="cohort-modal-header">
              <div>
                <span className="cohort-code-badge">{selectedBatch.code}</span>
                <h2 className="cohort-modal-title" style={{ marginTop: "6px" }}>
                  {selectedBatch.name}
                </h2>
              </div>
              <button
                type="button"
                className="cohort-modal-close-btn"
                onClick={() => {
                  setSelectedBatch(null);
                  setEditMode(false);
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "20px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    className={`cohort-category-tag ${
                      (CATEGORY_META[selectedBatch.category] || CATEGORY_META["General"]).tone
                    }`}
                  >
                    {(CATEGORY_META[selectedBatch.category] || CATEGORY_META["General"]).icon}{" "}
                    {selectedBatch.category}
                  </span>
                  <Badge tone={selectedBatch.status === "Active" ? "success" : "purple"}>
                    {selectedBatch.status}
                  </Badge>
                </div>

                <button
                  type="button"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: editMode ? "#eff6ff" : "#f8fafc",
                    border: "1px solid #cbd5e1",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    color: editMode ? "#1d4ed8" : "#334155"
                  }}
                  onClick={() => setEditMode(!editMode)}
                >
                  <Edit3 size={13} />
                  <span>{editMode ? "Cancel Editing" : "Edit Batch Data"}</span>
                </button>
              </div>

              {!editMode ? (
                /* View Details */
                <>
                  <div className="cohort-meta-details">
                    <div className="cohort-meta-item">
                      <BookOpen size={14} />
                      <span>
                        <strong>Associated Course:</strong> {selectedBatch.courseName}
                      </span>
                    </div>
                    <div className="cohort-meta-item">
                      <Clock size={14} />
                      <span>
                        <strong>Live Schedule:</strong> {selectedBatch.schedule}
                      </span>
                    </div>
                    <div className="cohort-meta-item">
                      <Calendar size={14} />
                      <span>
                        <strong>Duration:</strong> {selectedBatch.startDate} to {selectedBatch.endDate}
                      </span>
                    </div>
                    <div className="cohort-meta-item">
                      <Users size={14} />
                      <span>
                        <strong>Enrollment:</strong> {selectedBatch.enrolled} / {selectedBatch.capacity} seats filled (
                        {Math.round(((selectedBatch.enrolled || 0) / (selectedBatch.capacity || 1)) * 100)}%)
                      </span>
                    </div>
                  </div>

                  <div className="cohort-capacity-section">
                    <div className="capacity-head-row">
                      <span className="label">Curriculum Completion</span>
                      <span className="value">{selectedBatch.completion}%</span>
                    </div>
                    <div className="cohort-progress-track">
                      <div
                        className="cohort-progress-fill purple"
                        style={{ width: `${selectedBatch.completion}%` }}
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* Edit Batch Values (Allows setting actual enrolled learners, progress, capacity) */
                <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#1e293b" }}>
                      Enrolled Learners
                      <input
                        type="number"
                        min="0"
                        max={editCapacity}
                        value={editEnrolled}
                        onChange={(e) => setEditEnrolled(e.target.value)}
                        className="cohort-form-input"
                        style={{ marginTop: "4px" }}
                      />
                    </label>

                    <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#1e293b" }}>
                      Total Capacity
                      <input
                        type="number"
                        min="1"
                        value={editCapacity}
                        onChange={(e) => setEditCapacity(e.target.value)}
                        className="cohort-form-input"
                        style={{ marginTop: "4px" }}
                      />
                    </label>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#1e293b" }}>
                      Curriculum Progress (%)
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={editCompletion}
                        onChange={(e) => setEditCompletion(e.target.value)}
                        className="cohort-form-input"
                        style={{ marginTop: "4px" }}
                      />
                    </label>

                    <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#1e293b" }}>
                      Batch Status
                      <select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                        className="cohort-form-input"
                        style={{ marginTop: "4px" }}
                      >
                        <option value="Active">Active</option>
                        <option value="Upcoming">Upcoming</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </label>
                  </div>

                  <label style={{ fontSize: "12.5px", fontWeight: 600, color: "#1e293b" }}>
                    Weekly Schedule
                    <input
                      type="text"
                      value={editSchedule}
                      onChange={(e) => setEditSchedule(e.target.value)}
                      className="cohort-form-input"
                      style={{ marginTop: "4px" }}
                    />
                  </label>

                  <button
                    type="button"
                    className="btn-modal-publish"
                    style={{ alignSelf: "flex-end", marginTop: "6px" }}
                    onClick={handleSaveBatchEdits}
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
            <div className="cohort-modal-footer" style={{ justifyContent: "space-between" }}>
              <button
                type="button"
                style={{
                  background: "#fee2e2",
                  border: "1px solid #fca5a5",
                  color: "#dc2626",
                  padding: "9px 16px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
                onClick={() => handleDelete(selectedBatch.id, selectedBatch.name)}
              >
                <Trash2 size={14} />
                <span>Delete Batch</span>
              </button>

              <button
                type="button"
                className="btn-modal-cancel"
                onClick={() => {
                  setSelectedBatch(null);
                  setEditMode(false);
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper to parse schedule string into days and time cleanly
function parseSchedule(scheduleStr = "") {
  if (!scheduleStr) {
    return { days: "Mon, Wed, Fri", time: "6:00 PM – 8:00 PM" };
  }
  if (scheduleStr.includes("·")) {
    const [d, ...rest] = scheduleStr.split("·");
    return { days: d.trim(), time: rest.join("·").trim() };
  }
  if (scheduleStr.includes(" - ") || scheduleStr.includes(" – ")) {
    const delimiter = scheduleStr.includes(" – ") ? " – " : " - ";
    const parts = scheduleStr.split(delimiter);
    if (parts.length >= 2 && !/^\s*\d/.test(parts[0])) {
      return { days: parts[0].trim(), time: parts.slice(1).join(delimiter).trim() };
    }
  }
  return { days: scheduleStr, time: "6:00 PM – 8:00 PM" };
}

// Helper to render an individual batch card matching the uploaded design
function renderBatchCard(batch, onSelect, onDelete) {
  const capacityNum = Number(batch.capacity) || 120;
  const enrolledNum = Number(batch.enrolled) || 0;

  const { days, time } = parseSchedule(batch.schedule);

  const startText = batch.startDate
    ? (batch.startDate.toLowerCase().startsWith("starts") ? `${batch.startDate} –` : `Starts ${batch.startDate} –`)
    : "Starts Nov 2026 –";
  const endText = batch.endDate
    ? (batch.endDate.toLowerCase().startsWith("ends") ? batch.endDate : `Ends ${batch.endDate}`)
    : "Ends Feb 2027";

  return (
    <div key={batch.id} className="batch-modern-card">
      {/* Top Header Row */}
      <div className="batch-card-top">
        <div className="batch-card-left-header">
          {/* Details Column */}
          <div className="batch-card-title-col">
            {/* Badges Row */}
            <div className="batch-card-badges">
              <span className="batch-badge-category">
                <Briefcase size={14} />
                <span>{batch.category || "Software Development"}</span>
              </span>
              <span className="batch-badge-code">
                {batch.code || "JFS-27A"}
              </span>
              <span className="batch-badge-status">
                <span className="batch-status-dot green"></span>
                <span>{(batch.status || "ACTIVE").toUpperCase()}</span>
              </span>
            </div>

            {/* Batch Name */}
            <h3 className="batch-card-name">{batch.name}</h3>

            {/* Associated Course */}
            <div className="batch-card-course">
              <BookOpen size={16} />
              <span>{batch.courseName}</span>
            </div>
          </div>
        </div>

        {/* Delete Button on Top Right */}
        <button
          type="button"
          className="btn-batch-delete"
          title="Delete this batch"
          aria-label="Delete this batch"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(batch.id, batch.name);
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Horizontal Divider Line */}
      <div className="batch-card-divider" />

      {/* 3-Column Info Row */}
      <div className="batch-card-info-grid">
        {/* Column 1: Schedule */}
        <div className="batch-info-col batch-info-col-schedule">
          <div className="batch-info-circle-icon blue">
            <Clock size={20} />
          </div>
          <div className="batch-info-text">
            <span className="batch-info-primary">{days}</span>
            <span className="batch-info-secondary">{time}</span>
          </div>
        </div>

        {/* Column 2: Dates */}
        <div className="batch-info-col">
          <div className="batch-info-circle-icon purple">
            <Calendar size={20} />
          </div>
          <div className="batch-info-text">
            <span className="batch-info-primary">{startText}</span>
            <span className="batch-info-secondary">{endText}</span>
          </div>
        </div>

        {/* Column 3: Seats & Syllabus Pill Box */}
        <div className="batch-info-pill-box">
          <Users size={22} className="batch-pill-icon" />
          <div className="batch-pill-text">
            <strong className="batch-pill-primary">
              {enrolledNum} / {capacityNum} seats
            </strong>
            <span className="batch-pill-secondary">
              {batch.completion || 0}% syllabus covered
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action Button */}
      <button
        type="button"
        className="batch-card-manage-btn"
        onClick={() => onSelect(batch)}
      >
        <span>Manage Batch</span>
        <ChevronRight size={15} />
      </button>
    </div>
  );
}

export default Batches;
