import { useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";

/* LiveSessions.jsx - single file (component + styles). Usage: <LiveSessions />
   Page 1: overview (stats, demo switch, empty state or session cards)
   Page 2: schedule (form + live preview). Back returns to Page 1. */
const COURSES = ["Java Full Stack Development", "Python & Data Science", "AWS DevOps Engineer", "React 19 & Next.js Full Stack", "Distributed Microservices"];
const DURATIONS = [30, 45, 60, 90, 120];
const KEY = "tx_live_sessions_v2";
const SEED_DEMO = true;          // true: first scheduled class also adds demo cards (set false in production)
const DEMO_CONTROLS = true;      // shows the "Live demo controls" switch (set false in production)
const LIFETIME_ATTENDEES = 620, AVG_RATING = 4.96; // replace with API values
const NAMES = ["AS", "SR", "VP", "PV", "KJ", "NI", "RM", "AR", "MK", "IG"];
const SAMPLES = [ // [minutes from now, duration, title, course, description, registered, capacity]
  [-25, 90, "Mastering Distributed Transactions & Event-Driven Sagas", COURSES[4], "Saga choreography vs orchestration, Outbox pattern, and failure compensation.", 124, 150],
  [180, 90, "AWS EKS Zero-Downtime Migration Workshop", COURSES[2], "Blue/green node upgrades, CoreDNS tuning, and Karpenter autoscaling.", 156, 200],
  [1560, 60, "Spring Boot 3 Performance Tuning Clinic", COURSES[0], "Profiling slow endpoints, connection pools, and caching that actually helps.", 88, 120],
  [4440, 75, "From Pandas to Polars: Faster Data Pipelines", COURSES[1], "Rewrite a slow ETL job step by step and measure the speed-up.", 64, 100],
  [7200, 120, "Building with React Server Components, Live", COURSES[3], "Build a dashboard with streaming, Suspense and Server Actions.", 143, 200],
  [11520, 45, "Weekly Doubt-Clearing Office Hours", COURSES[0], "Bring questions on assignments, projects or interview prep.", 31, 60],
  [-2880, 75, "React 19 Concurrent Features & Server Actions Deep Dive", COURSES[3], "useActionState, useOptimistic, and Server Functions serialization rules.", 142, 150],
  [-8640, 105, "System Design Mock Interview & Architectural Critique", COURSES[0], "Designing a high-throughput URL shortener and real-time chat with WebSockets.", 198, 200],
  [-14400, 60, "Feature Engineering with scikit-learn", COURSES[1], "Pipelines, encoders and leakage traps, with live debugging.", 97, 120],
];

/* ---------- helpers ---------- */
const pad = (n) => String(n).padStart(2, "0");
const ymd = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const hm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
const startOf = (s) => new Date(`${s.date}T${s.time}`);
const endOf = (s) => new Date(startOf(s).getTime() + s.duration * 60000);
const sameDay = (a, b) => a.toDateString() === b.toDateString();
const statusOf = (s, n) => (n >= endOf(s) ? "completed" : n >= startOf(s) ? "live" : "scheduled");
const clock = (d) => d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" }).toUpperCase();
const whenText = (s, n) => { const d = startOf(s); return `${sameDay(d, n) ? "Today" : d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}, ${clock(d)}`; };
const labelOf = (s, st, n) => (st === "live" ? "Live now" : st === "completed" ? "Completed" : sameDay(startOf(s), n) ? "Starts today" : "Scheduled");
function rel(ms) {
  const m = Math.max(1, Math.round(ms / 60000));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  if (h < 24) return m % 60 ? `${h}h ${m % 60}m` : `${h}h`;
  return `${Math.floor(h / 24)} day${h >= 48 ? "s" : ""}`;
}
function makeSamples(now) {
  const base = Date.now();
  return SAMPLES.map(([m, duration, title, course, desc, registered, capacity], i) => {
    let t = now.getTime() + m * 60000;
    if (i) t = Math.round(t / 1800000) * 1800000; // snap to :00/:30 (first card stays "live")
    const d = new Date(t);
    return { id: base + i, date: ymd(d), time: hm(d), duration, title, course, desc, registered, capacity, link: "" };
  });
}
const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch { return []; } };
const save = (v) => { try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* ignore */ } };

/* ---------- icons + hooks + portal ---------- */
const P = {
  plus: "M12 5v14M5 12h14", cal: "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4", clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  users: "M9 11a3 3 0 100-6 3 3 0 000 6zM3 19c0-3 3-5 6-5s6 2 6 5M16 5.5a3 3 0 010 5.5M18 14c2 .6 3 2.2 3 5",
  live: "M12 12h.01M8.5 8.5a5 5 0 000 7M15.5 8.5a5 5 0 010 7M5.6 5.6a9 9 0 000 12.8M18.4 5.6a9 9 0 010 12.8", play: "M8 5l11 7-11 7z",
  check: "M5 12.5l4.5 4.5L19 7", trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
  link: "M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1", video: "M3 6h12v12H3zM15 10l6-3v10l-6-3",
  book: "M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19V5", bolt: "M13 3L5 14h6l-1 7 8-11h-6z", back: "M15 5l-7 7 7 7",
  search: "M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4", sparkle: "M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z",
};
const Icon = ({ n, s = 18 }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[n]} /></svg>
);
function useMounted(d = 100) { const [m, setM] = useState(false); useEffect(() => { const t = setTimeout(() => setM(true), d); return () => clearTimeout(t); }, [d]); return m; }
function useCountUp(target, dec = 0, ms = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, t0;
    const step = (t) => { if (!t0) t0 = t; const p = Math.min(1, (t - t0) / ms); setV(+(target * (1 - (1 - p) ** 3)).toFixed(dec)); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, dec, ms]);
  return v;
}
function useLock() { useEffect(() => { const p = document.body.style.overflow; document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = p; }; }, []); }
const Portal = ({ children }) => createPortal(<div className="ls ls-portal">{children}</div>, document.body);

function Toast({ text, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3200); return () => clearTimeout(t); }, [onDone]);
  return <Portal><div className="ls-toast" role="status"><span className="ls-tick"><Icon n="check" s={16} /></span>{text}</div></Portal>;
}
function Leave({ onKeep, onLeave }) {
  useLock();
  useEffect(() => { const h = (e) => e.key === "Escape" && onKeep(); window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h); });
  return (
    <Portal>
      <div className="ls-overlay" onMouseDown={(e) => e.target === e.currentTarget && onKeep()}>
        <div className="ls-dialog" role="alertdialog" aria-label="Discard this session?">
          <span className="ls-hicon"><Icon n="back" s={22} /></span>
          <h3>Discard this session?</h3>
          <p>You have started filling in the details. If you go back now, they will be lost.</p>
          <div className="ls-dbtns"><button className="ls-btn ghost" onClick={onKeep}>Keep editing</button><button className="ls-btn primary" onClick={onLeave}>Discard &amp; go back</button></div>
        </div>
      </div>
    </Portal>
  );
}

/* ---------- session card ---------- */
function SessionCard({ s, i, now, preview, fresh, leaving, confirming, onAsk, onCancelAsk, onDelete, notify }) {
  const st = statusOf(s, now), a = startOf(s), b = endOf(s), on = useMounted(300);
  const pct = st === "live" ? Math.min(100, Math.round(((now - a) / (b - a)) * 100)) : 0;
  const info = st === "live" ? `${rel(b - now)} left` : st === "scheduled" ? `Starts in ${rel(a - now)}` : `Ended ${rel(now - b)} ago`;
  const seat = Math.min(100, Math.round((s.registered / s.capacity) * 100)), shown = Math.min(4, s.registered), extra = s.registered - shown;
  const tilt = (e) => {
    const el = e.currentTarget, r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    el.style.setProperty("--ry", `${(x - 0.5) * 6}deg`); el.style.setProperty("--rx", `${(0.5 - y) * 6}deg`);
    el.style.setProperty("--mx", `${x * 100}%`); el.style.setProperty("--my", `${y * 100}%`);
  };
  const untilt = (e) => { e.currentTarget.style.setProperty("--rx", "0deg"); e.currentTarget.style.setProperty("--ry", "0deg"); };
  const enter = () => { if (s.link) window.open(s.link, "_blank", "noopener"); notify(s.link ? "Opening your live classroom" : "Classroom is ready. Add a meeting link to open it."); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(s.link || `${s.title} · ${whenText(s, now)}`); notify(s.link ? "Invite link copied" : "Session details copied"); }
    catch { notify("Couldn't copy. Please copy it manually."); }
  };
  return (
    <article className={`ls-card ${st} ${preview ? "preview" : ""} ${fresh ? "fresh" : ""} ${leaving ? "leaving" : ""}`} style={{ "--i": Math.min(i, 8) }} onMouseMove={tilt} onMouseLeave={untilt}>
      <div className="ls-row">
        <div className={`ls-date ${st}`} aria-hidden="true"><span>{a.toLocaleDateString("en-IN", { weekday: "short" })}</span><b>{a.getDate()}</b><span>{a.toLocaleDateString("en-IN", { month: "short" })}</span></div>
        <div className="ls-main">
          <div className="ls-ctop"><span className="ls-course"><Icon n="book" s={14} />{s.course}</span><span className={`ls-pill ${st}`}>{st === "live" && <span className="ls-dot" />}{labelOf(s, st, now)}</span></div>
          <h3>{s.title}</h3>
          {s.desc && <p className="ls-desc">{s.desc}</p>}
        </div>
      </div>
      <div className="ls-meta"><span><Icon n="clock" s={15} />{clock(a)}</span><span><Icon n="video" s={15} />{s.duration} mins</span><span className={`ls-info ${st}`}>{info}</span></div>
      {st === "live" && <div className="ls-progress"><span style={{ width: `${pct}%` }} /></div>}
      <div className="ls-seats">
        <div className="ls-seatrow">
          {s.registered > 0 ? <div className="ls-avs">{Array.from({ length: shown }, (_, k) => <span key={k} style={{ "--k": k }}>{NAMES[(s.id + k) % NAMES.length]}</span>)}{extra > 0 && <span className="more" style={{ "--k": shown }}>+{Math.min(extra, 99)}</span>}</div> : <span className="ls-faint">No registrations yet</span>}
          <b>{s.registered}<small> / {s.capacity} seats</small></b>
        </div>
        <div className="ls-bar"><span style={{ width: on ? `${seat}%` : 0 }} /></div>
      </div>
      {preview ? null : confirming ? (
        <div className="ls-confirm"><span>Cancel this session?</span><button className="ls-btn ghost sm" onClick={onCancelAsk}>Keep it</button><button className="ls-btn primary sm" onClick={onDelete}>Yes, cancel</button></div>
      ) : (
        <div className="ls-actions">
          {st === "live" && <button className="ls-btn primary grow shine" onClick={enter}><Icon n="live" s={16} />Enter live classroom</button>}
          {st === "scheduled" && <button className="ls-btn outline grow" onClick={copy}><Icon n="link" s={16} />Copy invite</button>}
          {st === "completed" && <button className="ls-btn outline grow" onClick={() => notify("Recording will appear here once it's processed")}><Icon n="play" s={16} />Watch past recording</button>}
          <button className="ls-iconbtn" onClick={onAsk} aria-label="Cancel session" title="Cancel session"><Icon n="trash" s={17} /></button>
        </div>
      )}
    </article>
  );
}

/* ---------- page 2: schedule ---------- */
const Field = ({ id, label, opt, err, children }) => (
  <div className="ls-field"><label htmlFor={id}>{label}{opt && <span className="ls-opt">Optional</span>}</label>{children}{err && <small className="ls-err">{err}</small>}</div>
);
function SchedulePage({ onBack, onSave, onDirty }) {
  const h = new Date(Date.now() + 3600000); h.setMinutes(0, 0, 0);
  const [f, setF] = useState({ title: "", course: "", desc: "", date: ymd(h), time: hm(h), duration: 60, capacity: 100, link: "" });
  const [err, setErr] = useState({}), [busy, setBusy] = useState(false);
  const dirty = !!(f.title.trim() || f.desc.trim() || f.link.trim() || f.course);
  useEffect(() => { onDirty(dirty); }, [dirty, onDirty]);
  const set = (k, v) => { setF((p) => ({ ...p, [k]: v })); setErr((p) => ({ ...p, [k]: null })); };
  const startNow = () => { const d = new Date(); setF((p) => ({ ...p, date: ymd(d), time: hm(d) })); setErr((p) => ({ ...p, date: null, time: null })); };
  const submit = (e) => {
    e.preventDefault();
    const er = {};
    if (!f.title.trim()) er.title = "Give the session a title.";
    if (!f.course) er.course = "Choose a course or batch.";
    if (!f.date) er.date = "Pick a date.";
    if (!f.time) er.time = "Pick a start time.";
    if (!(+f.capacity >= 1)) er.capacity = "Enter at least 1 seat.";
    if (f.date && f.time && startOf(f) < new Date(Date.now() - 300000)) er.time = "That time has already passed.";
    setErr(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    setTimeout(() => onSave({ id: Date.now(), ...f, capacity: Math.round(+f.capacity), title: f.title.trim(), desc: f.desc.trim(), link: f.link.trim(), registered: 0 }), 700);
  };
  const preview = useMemo(() => {
    const ok = f.date && f.time, d = new Date(Date.now() + 3600000);
    return { id: 7, registered: 0, link: "", title: f.title.trim() || "Your session title", course: f.course || "Select a course", desc: f.desc.trim() || "What you will cover will appear here for learners.",
      date: ok ? f.date : ymd(d), time: ok ? f.time : hm(d), duration: f.duration, capacity: Math.max(1, Math.round(+f.capacity) || 1) };
  }, [f]);
  return (
    <div className="ls-sched">
      <form className="ls-formcard" onSubmit={submit} noValidate>
        <div className="ls-fhead"><span className="ls-hicon"><Icon n="video" s={22} /></span><div><h2>Session details</h2><p>Learners in the chosen course will see this on their dashboard.</p></div></div>
        <div className="ls-body">
          <Field id="t" label="Session title" err={err.title}><input id="t" autoFocus className={err.title ? "bad" : ""} value={f.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Mastering Event-Driven Sagas" /></Field>
          <Field id="c" label="Course / batch" err={err.course}>
            <select id="c" className={err.course ? "bad" : ""} value={f.course} onChange={(e) => set("course", e.target.value)}><option value="">Select a course</option>{COURSES.map((c) => <option key={c}>{c}</option>)}</select>
          </Field>
          <Field id="d" label="What will you cover?" opt><textarea id="d" rows="3" value={f.desc} onChange={(e) => set("desc", e.target.value)} placeholder="Short summary learners will read before joining" /></Field>
          <div className="ls-two">
            <Field id="dt" label="Date" err={err.date}><input id="dt" type="date" min={ymd(new Date())} className={err.date ? "bad" : ""} value={f.date} onChange={(e) => set("date", e.target.value)} /></Field>
            <Field id="tm" label="Start time" err={err.time}><input id="tm" type="time" className={err.time ? "bad" : ""} value={f.time} onChange={(e) => set("time", e.target.value)} /></Field>
          </div>
          <button type="button" className="ls-now" onClick={startNow}><Icon n="bolt" s={14} />Start right now</button>
          <Field label="Duration"><div className="ls-chips" role="radiogroup">{DURATIONS.map((d) => <button type="button" key={d} role="radio" aria-checked={f.duration === d} className={f.duration === d ? "on" : ""} onClick={() => set("duration", d)}>{d} min</button>)}</div></Field>
          <Field id="cp" label="Max attendees" err={err.capacity}><input id="cp" type="number" min="1" className={err.capacity ? "bad" : ""} value={f.capacity} onChange={(e) => set("capacity", e.target.value)} /></Field>
          <Field id="lk" label="Meeting link" opt><div className="ls-ic"><Icon n="link" s={16} /><input id="lk" value={f.link} onChange={(e) => set("link", e.target.value)} placeholder="https://meet.example.com/your-room" /></div></Field>
        </div>
        <footer>
          <button type="button" className="ls-btn ghost" onClick={onBack} disabled={busy}><Icon n="back" s={16} />Back</button>
          <button type="submit" className="ls-btn primary" disabled={busy}>{busy ? <span className="ls-spin" /> : <Icon n="cal" s={16} />}{busy ? "Scheduling…" : "Schedule session"}</button>
        </footer>
      </form>
      <aside className="ls-previewcol"><div className="ls-previewlabel"><Icon n="sparkle" s={15} />Live preview</div><SessionCard preview s={preview} i={0} now={new Date()} notify={() => {}} /></aside>
    </div>
  );
}

/* ---------- page 1: overview ---------- */
function Stat({ label, val, dec = 0, unit, sub, icon, i }) {
  const n = useCountUp(val, dec);
  return (
    <div className="ls-stat" style={{ "--i": i }}>
      <div className="ls-stat-top"><small>{label}</small><span className="ls-stat-ic"><Icon n={icon} s={17} /></span></div>
      <b>{n.toFixed(dec)}{unit && <span className="ls-unit">{unit}</span>}</b><span className="ls-sub">{sub}</span>
    </div>
  );
}
function Empty({ onCreate }) {
  return (
    <div className="ls-empty">
      <div className="ls-hero" aria-hidden="true"><span className="ls-ring" /><span className="ls-ring" /><span className="ls-ring" /><span><Icon n="cal" s={34} /></span></div>
      <span className="ls-badge"><Icon n="live" s={13} />Live classroom</span>
      <h2>No live sessions yet</h2>
      <p>Schedule your first live class and it will appear here. Your learners are notified the moment you publish a session.</p>
      <button className="ls-btn primary big" onClick={onCreate}><Icon n="plus" s={18} />Schedule live class</button>
    </div>
  );
}

export default function LiveSessions({ sessions: propSessions, onAddSession }) {
  const [sessions, setSessions] = useState(() => {
    const loaded = load();
    if (loaded && loaded.length) return loaded;
    if (propSessions && propSessions.length) return propSessions;
    return makeSamples(new Date());
  });
  const [view, setView] = useState("overview"), [filter, setFilter] = useState("all"), [q, setQ] = useState("");
  const [now, setNow] = useState(() => new Date()), [toast, setToast] = useState(null), [confirmId, setConfirmId] = useState(null);
  const [freshId, setFreshId] = useState(null), [leavingId, setLeavingId] = useState(null), [dirty, setDirty] = useState(false), [leaveAsk, setLeaveAsk] = useState(false);
  const clearToast = useCallback(() => setToast(null), []);
  useEffect(() => { save(sessions); }, [sessions]);
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 30000); return () => clearInterval(t); }, []);

  const all = useMemo(() => sessions.map((s) => ({ s, st: statusOf(s, now) })), [sessions, now]);
  const pick = (st) => all.filter((x) => x.st === st && (x.s.title + x.s.course).toLowerCase().includes(q.trim().toLowerCase()));
  const live = pick("live"), upcoming = pick("scheduled").sort((x, y) => startOf(x.s) - startOf(y.s)), done = pick("completed").sort((x, y) => startOf(y.s) - startOf(x.s));
  const open = all.filter((x) => x.st !== "completed").sort((x, y) => startOf(x.s) - startOf(y.s)), nextUp = open[0];
  const groups = (filter === "all" ? [["Live now", live], ["Coming up", upcoming], ["Past sessions", done]] : filter === "upcoming" ? [["Upcoming", [...live, ...upcoming]]] : [["Past sessions", done]]).filter(([, l]) => l.length);
  const scheduling = view === "schedule";

  const leave = () => { setLeaveAsk(false); setDirty(false); setView("overview"); };
  const goBack = () => (dirty ? setLeaveAsk(true) : leave());
  const handleSave = (s) => {
    setSessions((p) => (!p.length && SEED_DEMO ? [s, ...makeSamples(new Date())] : [s, ...p]));
    if (typeof onAddSession === "function") {
      try { onAddSession(s); } catch { /* ignore */ }
    }
    setDirty(false); setView("overview"); setFilter("all"); setQ(""); setFreshId(s.id); setTimeout(() => setFreshId(null), 2600); setToast("Session scheduled");
  };
  const remove = (id) => { setConfirmId(null); setLeavingId(id); setTimeout(() => { setSessions((p) => p.filter((x) => x.id !== id)); setLeavingId(null); setToast("Session cancelled"); }, 320); };

  let idx = 0;
  return (
    <div className="ls">
      <style>{CSS}</style>
      {scheduling && <button className="ls-back" onClick={goBack}><Icon n="back" s={16} />Back</button>}
      <nav className="ls-crumbs"><span>TX Pathwing</span>/<span>Instructor</span>/<span className={scheduling ? "" : "cur"}>Live Classroom &amp; Sessions</span>{scheduling && <><span>/</span><span className="cur">Schedule</span></>}</nav>
      <div className="ls-head">
        <div>
          <h1>{scheduling ? "Schedule a live class" : "Live Classroom & Interactive Webinars"}</h1>
          <p>{scheduling ? "Fill in the details. The preview on the right updates as you type." : "Host live engineering sessions, teach in real time and keep every learner engaged — all from one calm, focused classroom."}</p>
        </div>
        {!scheduling && <button className="ls-btn primary" onClick={() => setView("schedule")}><Icon n="plus" s={17} />Schedule Live Class</button>}
      </div>

      {scheduling ? <SchedulePage onBack={goBack} onDirty={setDirty} onSave={handleSave} /> : (
        <>
          <div className="ls-stats">
            <Stat i={0} icon="cal" label="Upcoming sessions" val={open.length} sub={nextUp ? (nextUp.st === "live" ? "A session is live right now" : `Next: ${whenText(nextUp.s, now)}`) : "Ready when you are"} />
            <Stat i={1} icon="users" label="Total live attendees" val={LIFETIME_ATTENDEES} sub="Learners joined live classrooms" />
            <Stat i={2} icon="star" label="Session engagement" val={AVG_RATING} dec={2} unit="stars" sub="Average learner rating" />
          </div>
          {DEMO_CONTROLS && (
            <div className="ls-demo">
              <div><b>Live demo controls</b><p>Preview the empty state first, then switch to a classroom with sessions.</p></div>
              <div className="ls-toggle" role="group" aria-label="Demo mode">
                <button className={sessions.length ? "on" : ""} onClick={() => { if (!sessions.length) { setSessions(makeSamples(new Date())); setFilter("all"); setQ(""); } }}>Show Demo: With Sessions</button>
                <button className={!sessions.length ? "on" : ""} onClick={() => { setSessions([]); setQ(""); }}>Show Demo: No Sessions</button>
              </div>
            </div>
          )}
          {!sessions.length ? <Empty onCreate={() => setView("schedule")} /> : (
            <>
              <div className="ls-bar-top">
                <div className="ls-filters" role="tablist">
                  {[["all", "All", sessions.length], ["upcoming", "Upcoming", open.length], ["completed", "Completed", all.length - open.length]].map(([k, label, n]) => (
                    <button key={k} role="tab" aria-selected={filter === k} className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>{label}<span className="ls-count">{n}</span></button>
                  ))}
                </div>
                <label className="ls-search"><Icon n="search" s={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search sessions or courses…" /></label>
              </div>
              {!groups.length ? <div className="ls-none">No sessions match your filters.</div> : (
                <div key={filter + q.length}>
                  {groups.map(([title, list]) => (
                    <section className="ls-sec" key={title}>
                      <h4><span>{title}</span><b>{list.length}</b></h4>
                      <div className="ls-grid">
                        {list.map(({ s }) => <SessionCard key={s.id} s={s} i={idx++} now={now} fresh={freshId === s.id} leaving={leavingId === s.id} confirming={confirmId === s.id}
                          onAsk={() => setConfirmId(s.id)} onCancelAsk={() => setConfirmId(null)} onDelete={() => remove(s.id)} notify={setToast} />)}
                      </div>
                    </section>
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
      {leaveAsk && <Leave onKeep={() => setLeaveAsk(false)} onLeave={leave} />}
      {toast && <Toast key={toast} text={toast} onDone={clearToast} />}
    </div>
  );
}
export { LiveSessions, LiveSessions as LiveSessionsPage }; // works with default or named imports

/* ---------- styles (white + blue) ---------- */
const CSS = `
.ls{--blue:#2563eb;--sky:#eaf2ff;--line:#e3ebf8;--ink:#0f1d3a;--mut:#64748b;font-family:Inter,system-ui,sans-serif;color:var(--ink);padding:0 0 48px}
.ls *{box-sizing:border-box}.ls.ls-portal{padding:0}.ls :focus-visible{outline:2px solid var(--blue);outline-offset:2px}
:where(.ls) button{font:inherit;cursor:pointer;border:0;background:none;color:inherit;padding:0;margin:0}
:where(.ls) :is(input,select,textarea){font:inherit;color:inherit}
:where(.ls) :is(h1,h2,h3,h4,p){margin:0;padding:0;font-family:inherit;letter-spacing:normal}
.ls-crumbs{display:flex;gap:8px;font-size:13px;color:var(--mut);margin-bottom:6px}.ls-crumbs .cur{color:var(--blue);font-weight:600}
.ls-head{display:flex;justify-content:space-between;align-items:flex-end;gap:16px;flex-wrap:wrap;margin:6px 0 24px}
.ls-head h1{font-size:30px;font-weight:800;letter-spacing:-.02em;line-height:1.2}.ls-head p{margin-top:4px;color:var(--mut);max-width:640px}
.ls-back{display:inline-flex;align-items:center;gap:6px;margin:0 0 10px -8px;padding:6px 14px 6px 8px;border-radius:10px;font-weight:600;font-size:14px;color:var(--blue);transition:.2s}
.ls-back:hover{background:var(--sky);transform:translateX(-3px)}
.ls-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 20px;border-radius:12px;font-weight:600;font-size:14px;transition:transform .15s,box-shadow .2s,background .2s}
.ls-btn.primary{background:linear-gradient(135deg,#3b82f6,#2563eb);color:#fff;box-shadow:0 6px 16px rgba(37,99,235,.3)}
.ls-btn.primary:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 10px 24px rgba(37,99,235,.4)}
.ls-btn:active:not(:disabled){transform:scale(.97)}.ls-btn:disabled{opacity:.6;cursor:not-allowed}
.ls-btn.outline{background:#fff;color:var(--blue);border:1.5px solid #bcd3fb}.ls-btn.outline:hover{background:var(--sky)}
.ls-btn.ghost{color:var(--mut)}.ls-btn.ghost:hover:not(:disabled){background:var(--sky);color:var(--blue)}
.ls-btn.big{padding:14px 28px;font-size:15px;border-radius:14px}.ls-btn.sm{padding:7px 14px;font-size:13px;border-radius:9px}.ls-btn.grow{flex:1}
.ls-btn.shine{position:relative;overflow:hidden}.ls-btn.shine::after{content:"";position:absolute;top:0;bottom:0;width:60px;left:-80px;background:linear-gradient(100deg,transparent,rgba(255,255,255,.45),transparent);animation:lsShine 3s ease-in-out infinite}
@keyframes lsShine{0%,55%{left:-80px}100%{left:120%}}
.ls-iconbtn{width:44px;height:44px;border:1.5px solid var(--line);border-radius:12px;background:#fff;display:grid;place-items:center;color:var(--mut);transition:.2s;flex:none}.ls-iconbtn:hover{background:var(--sky);color:var(--blue)}
.ls-spin{width:16px;height:16px;border-radius:50%;border:2.5px solid rgba(255,255,255,.4);border-top-color:#fff;animation:lsRot .7s linear infinite}@keyframes lsRot{to{transform:rotate(360deg)}}
@keyframes lsUp{from{opacity:0;transform:translateY(14px)}}
.ls-stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:16px;margin-bottom:18px}
.ls-stat{background:#fff;border:1px solid var(--line);border-radius:18px;padding:18px 20px;box-shadow:0 8px 24px rgba(37,99,235,.06);animation:lsUp .5s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i)*80ms)}
.ls-stat-top{display:flex;justify-content:space-between;align-items:flex-start;gap:10px}.ls-stat small{font-size:13px;font-weight:600;color:var(--mut)}
.ls-stat-ic{width:36px;height:36px;border-radius:11px;background:var(--sky);color:var(--blue);display:grid;place-items:center;flex:none}
.ls-stat b{display:flex;align-items:baseline;gap:6px;margin:10px 0 6px;font-size:30px;font-weight:800;letter-spacing:-.02em}.ls-unit{font-size:14px;font-weight:500;color:var(--mut)}.ls-sub{font-size:13px;color:var(--blue);font-weight:500}
.ls-demo{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;margin:6px 0 18px}.ls-demo b{font-size:14px}.ls-demo p{margin-top:2px;font-size:12.5px;color:var(--mut)}
.ls-toggle{display:inline-flex;background:var(--sky);border:1px solid var(--line);border-radius:99px;padding:4px}
.ls-toggle button{padding:9px 18px;border-radius:99px;font-size:13px;font-weight:600;color:var(--blue);transition:.25s}.ls-toggle button:hover:not(.on){background:#fff}.ls-toggle button.on{background:var(--blue);color:#fff;box-shadow:0 6px 14px rgba(37,99,235,.3)}
.ls-empty{display:flex;flex-direction:column;align-items:center;text-align:center;border:2px dashed #b9d0f7;background:linear-gradient(180deg,#f8fbff,#fff);border-radius:24px;padding:60px 24px 54px;animation:lsUp .5s cubic-bezier(.2,.8,.2,1)}
.ls-empty h2{font-size:24px;font-weight:800;margin-top:14px}.ls-empty p{max-width:400px;margin:8px 0 26px;color:var(--mut);line-height:1.6}
.ls-badge{display:inline-flex;align-items:center;gap:6px;margin-top:26px;padding:5px 12px;border-radius:99px;background:#fff;border:1px solid #bcd3fb;color:var(--blue);font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase}
.ls-hero{position:relative;width:96px;height:96px;display:grid;place-items:center}
.ls-hero>span:last-child{position:relative;width:84px;height:84px;border-radius:26px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;display:grid;place-items:center;box-shadow:0 14px 30px rgba(37,99,235,.35);animation:lsFloat 3s ease-in-out infinite}
.ls-ring{position:absolute;inset:0;border-radius:30px;border:2px solid #93bbfa;opacity:0;animation:lsPulse 3s ease-out infinite}.ls-ring:nth-child(2){animation-delay:1s}.ls-ring:nth-child(3){animation-delay:2s}
@keyframes lsPulse{0%{transform:scale(.9);opacity:.7}100%{transform:scale(1.9);opacity:0}}@keyframes lsFloat{50%{transform:translateY(-6px)}}
.ls-bar-top{display:flex;gap:12px;align-items:center;flex-wrap:wrap}
.ls-filters{display:inline-flex;gap:6px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:4px}
.ls-filters button{display:inline-flex;align-items:center;gap:8px;padding:8px 16px;border-radius:10px;font-size:14px;color:var(--mut);transition:.2s}.ls-filters button:hover{color:var(--blue)}
.ls-filters button.on{background:var(--blue);color:#fff;font-weight:600;box-shadow:0 6px 14px rgba(37,99,235,.3)}
.ls-count{font-size:12px;font-weight:700;min-width:22px;padding:1px 7px;border-radius:99px;background:var(--sky);color:var(--blue);text-align:center}.ls-filters .on .ls-count{background:rgba(255,255,255,.25);color:#fff}
.ls-search{display:flex;align-items:center;gap:10px;flex:1;min-width:220px;max-width:420px;background:#fff;border:1px solid var(--line);border-radius:14px;padding:0 14px;color:var(--mut);transition:.2s}
.ls-search:focus-within{border-color:var(--blue);box-shadow:0 0 0 4px rgba(37,99,235,.12)}.ls-search input{flex:1;min-width:0;border:0;outline:0;background:none;padding:11px 0;font-size:14px}
.ls-none{background:#fff;border:1px dashed #bcd3fb;border-radius:16px;padding:40px;text-align:center;color:var(--mut);margin-top:18px}
.ls-sec{margin-top:26px}.ls-sec h4{display:flex;align-items:center;gap:10px;margin:0 0 14px;font-size:15px;font-weight:700}
.ls-sec h4::after{content:"";order:3;flex:1;height:1px;background:linear-gradient(90deg,var(--line),transparent)}.ls-sec h4 b{font-size:12px;color:var(--blue);background:var(--sky);padding:2px 9px;border-radius:99px}
.ls-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(400px,1fr));gap:20px}
.ls-card{--rx:0deg;--ry:0deg;--ty:0px;position:relative;background:#fff;border:1px solid var(--line);border-radius:22px;padding:22px;overflow:hidden;box-shadow:0 1px 2px rgba(15,29,58,.04),0 10px 28px rgba(37,99,235,.07);
  transform:perspective(1000px) rotateX(var(--rx)) rotateY(var(--ry)) translateY(var(--ty));transition:transform .18s ease-out,box-shadow .3s,border-color .3s;animation:lsCard .7s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(var(--i)*70ms)}
@keyframes lsCard{from{opacity:0;transform:translateY(28px) scale(.95);filter:blur(6px)}}
.ls-card::before{content:"";position:absolute;inset:0 0 auto 0;height:4px;background:#d6e5fb}.ls-card.scheduled::before{background:linear-gradient(90deg,#93c5fd,#3b82f6)}
.ls-card.live::before{background:linear-gradient(90deg,#60a5fa,#1d4ed8,#60a5fa);background-size:200% 100%;animation:lsSlide 2.4s linear infinite}@keyframes lsSlide{to{background-position:-200% 0}}
.ls-card::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:0;transition:opacity .3s;background:radial-gradient(440px circle at var(--mx,50%) var(--my,0%),rgba(59,130,246,.13),transparent 45%)}
.ls-card:hover{--ty:-5px;border-color:#bcd3fb;box-shadow:0 22px 46px rgba(37,99,235,.18)}.ls-card:hover::after{opacity:1}
.ls-card.live{border-color:#93bbfa;animation:lsCard .7s cubic-bezier(.2,.8,.2,1) both,lsGlow 2.8s ease-in-out .8s infinite;animation-delay:calc(var(--i)*70ms),0s}
@keyframes lsGlow{50%{box-shadow:0 0 0 6px rgba(37,99,235,.1),0 16px 40px rgba(37,99,235,.24)}}
.ls-card.fresh{animation:lsCard .7s cubic-bezier(.2,.8,.2,1) both,lsFresh 2.4s ease-out}@keyframes lsFresh{0%,60%{box-shadow:0 0 0 0 rgba(37,99,235,.55)}100%{box-shadow:0 0 0 22px rgba(37,99,235,0)}}
.ls-card.leaving{animation:lsOut .32s ease-in forwards}@keyframes lsOut{to{opacity:0;transform:scale(.9) translateY(10px);filter:blur(4px)}}.ls-card.preview{animation:none}
.ls-row{display:flex;gap:16px;align-items:flex-start}.ls-main{flex:1;min-width:0}
.ls-date{flex:none;width:64px;padding:9px 0 10px;border-radius:16px;text-align:center;display:grid;gap:1px;background:var(--sky);color:var(--blue);transition:transform .3s}
.ls-date span{font-size:11.5px;font-weight:600;opacity:.85}.ls-date b{font-size:24px;font-weight:800;line-height:1.05}
.ls-date.live{background:linear-gradient(160deg,#3b82f6,#1d4ed8);color:#fff;box-shadow:0 8px 18px rgba(37,99,235,.35)}.ls-date.completed{background:#f1f5f9;color:var(--mut)}.ls-card:hover .ls-date{transform:scale(1.06) rotate(-2deg)}
.ls-ctop{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:10px;flex-wrap:wrap}
.ls-course{display:inline-flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:var(--blue);background:var(--sky);padding:5px 10px;border-radius:8px;min-width:0;max-width:100%}
.ls-pill{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;padding:5px 11px;border-radius:99px;white-space:nowrap;flex:none}
.ls-pill.live{background:var(--blue);color:#fff}.ls-pill.scheduled{background:#fff;color:var(--blue);border:1px solid #bcd3fb}.ls-pill.completed{background:#f1f5f9;color:var(--mut)}
.ls-dot{width:8px;height:8px;border-radius:50%;background:#fff;animation:lsBlink 1.2s ease-in-out infinite}@keyframes lsBlink{50%{opacity:.25;transform:scale(.7)}}
.ls-card h3{font-size:18.5px;font-weight:700;line-height:1.35;letter-spacing:-.01em}
.ls-desc{margin-top:6px;color:var(--mut);font-size:14px;line-height:1.55;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.ls-meta{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 14px}.ls-meta span{display:inline-flex;align-items:center;gap:7px;font-size:13px;background:#f6f9ff;border:1px solid var(--line);padding:6px 11px;border-radius:9px}
.ls-meta svg{color:var(--blue)}.ls-meta .ls-info{margin-left:auto;background:var(--sky);border-color:transparent;color:var(--blue);font-weight:600}
.ls-meta .ls-info.live{background:var(--blue);color:#fff}.ls-meta .ls-info.completed{background:#f1f5f9;color:var(--mut)}
.ls-progress{height:6px;border-radius:99px;background:#dbe8fd;overflow:hidden;margin:-2px 0 14px}.ls-progress span{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#60a5fa,#2563eb);transition:width 1s}
.ls-seats{margin-bottom:18px}.ls-seatrow{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:9px;min-height:32px}
.ls-seatrow b{font-size:15px;font-weight:700}.ls-seatrow small{font-size:12.5px;color:var(--mut);font-weight:500}.ls-faint{font-size:13px;color:var(--mut)}
.ls-avs{display:flex}.ls-avs span{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;margin-left:-9px;font-size:11px;font-weight:700;background:var(--sky);color:var(--blue);border:2.5px solid #fff;animation:lsAv .5s cubic-bezier(.3,1.4,.5,1) both;animation-delay:calc(var(--k)*70ms + 500ms)}
.ls-avs span:first-child{margin-left:0}.ls-avs .more{background:var(--blue);color:#fff}@keyframes lsAv{from{transform:scale(0);opacity:0}}
.ls-bar{height:8px;background:#e6eefc;border-radius:99px;overflow:hidden}.ls-bar span{display:block;height:100%;border-radius:99px;background:linear-gradient(90deg,#60a5fa,#2563eb);transition:width 1.2s cubic-bezier(.2,.8,.2,1)}
.ls-actions{display:flex;gap:10px}.ls-confirm{display:flex;align-items:center;gap:8px;justify-content:flex-end;background:var(--sky);border-radius:12px;padding:8px 10px;animation:lsUp .25s}
.ls-confirm span{margin-right:auto;font-size:13.5px;font-weight:600;color:var(--blue)}
.ls-sched{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:24px;align-items:start;animation:lsUp .5s cubic-bezier(.2,.8,.2,1)}
.ls-formcard{background:#fff;border:1px solid var(--line);border-radius:24px;overflow:hidden;box-shadow:0 10px 30px rgba(37,99,235,.08)}
.ls-fhead{display:flex;gap:14px;align-items:center;padding:20px 22px;border-bottom:1px solid var(--line);background:linear-gradient(180deg,#f3f8ff,#fff)}
.ls-fhead h2{font-size:19px;font-weight:800}.ls-fhead p{margin-top:2px;font-size:13px;color:var(--mut)}
.ls-hicon{width:46px;height:46px;border-radius:14px;background:linear-gradient(135deg,#3b82f6,#1d4ed8);color:#fff;display:grid;place-items:center;flex:none}
.ls-body{padding:20px 22px 6px;display:grid;gap:16px}.ls-field{display:grid;gap:7px;min-width:0}.ls-field label{font-size:13px;font-weight:600}.ls-opt{font-weight:400;color:var(--mut);margin-left:6px;font-size:12px}
.ls-field :is(input,select,textarea){width:100%;border:1.5px solid var(--line);border-radius:12px;background:#fff;padding:11px 14px;font-size:14.5px;transition:border-color .2s,box-shadow .2s}
.ls-field textarea{resize:vertical;min-height:84px;line-height:1.5}.ls-field :is(input,select,textarea):hover{border-color:#bcd3fb}
.ls-field :is(input,select,textarea):focus{outline:0;border-color:var(--blue);box-shadow:0 0 0 4px rgba(37,99,235,.12)}.ls-field .bad{border-color:var(--blue);background:#f6f9ff}
.ls-field select{appearance:none;-webkit-appearance:none;padding-right:38px;background:#fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%232563eb' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 12px center}
.ls-err{font-size:12.5px;color:var(--blue);font-weight:600;animation:lsUp .25s}.ls-two{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.ls-now{justify-self:start;display:inline-flex;align-items:center;gap:6px;margin-top:-6px;padding:6px 12px;border-radius:99px;font-size:12.5px;font-weight:600;color:var(--blue);background:var(--sky);transition:.2s}.ls-now:hover{background:var(--blue);color:#fff}
.ls-chips{display:flex;flex-wrap:wrap;gap:8px}.ls-chips button{padding:8px 14px;border-radius:10px;border:1.5px solid var(--line);font-size:13.5px;transition:.2s}.ls-chips button:hover{border-color:#bcd3fb;color:var(--blue)}
.ls-chips button.on{background:var(--blue);border-color:var(--blue);color:#fff;font-weight:600;box-shadow:0 5px 12px rgba(37,99,235,.28)}
.ls-ic{position:relative}.ls-ic svg{position:absolute;left:13px;top:50%;transform:translateY(-50%);color:var(--blue)}.ls-ic input{padding-left:38px!important}
.ls-formcard footer{display:flex;justify-content:space-between;gap:10px;padding:16px 22px;border-top:1px solid var(--line);margin-top:14px}
.ls-previewcol{position:sticky;top:16px}.ls-previewlabel{display:flex;align-items:center;gap:8px;font-size:13px;font-weight:600;color:var(--blue);margin-bottom:12px}
.ls-overlay{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(15,29,58,.42);backdrop-filter:blur(4px);animation:lsFade .25s}@keyframes lsFade{from{opacity:0}}
.ls-dialog{width:min(420px,100%);background:#fff;border-radius:22px;padding:28px 26px 22px;text-align:center;display:grid;justify-items:center;gap:8px;box-shadow:0 30px 80px rgba(15,29,58,.3);animation:lsPop .35s cubic-bezier(.2,1.1,.3,1)}
@keyframes lsPop{from{opacity:0;transform:translateY(26px) scale(.94)}}.ls-dialog h3{font-size:19px;font-weight:800;margin-top:8px}.ls-dialog p{color:var(--mut);font-size:14px;line-height:1.6;max-width:320px}
.ls-dbtns{display:flex;gap:10px;margin-top:14px;flex-wrap:wrap;justify-content:center}
.ls-toast{position:fixed;left:50%;bottom:32px;transform:translateX(-50%);z-index:2147483100;display:flex;align-items:center;gap:10px;background:var(--ink);color:#fff;padding:12px 20px 12px 12px;border-radius:14px;font-size:14px;font-weight:500;box-shadow:0 14px 36px rgba(15,29,58,.35);animation:lsToast 3.2s cubic-bezier(.2,.9,.3,1) both}
.ls-tick{width:26px;height:26px;border-radius:50%;background:#3b82f6;display:grid;place-items:center}
@keyframes lsToast{0%{opacity:0;transform:translate(-50%,20px)}10%,88%{opacity:1;transform:translate(-50%,0)}100%{opacity:0;transform:translate(-50%,10px)}}
@media (max-width:1000px){.ls-sched{grid-template-columns:1fr}.ls-previewcol{position:static}}
@media (max-width:640px){.ls-head h1{font-size:24px}.ls-grid{grid-template-columns:1fr}.ls-two{grid-template-columns:1fr}.ls-row{flex-direction:column}.ls-meta .ls-info{margin-left:0}}
@media (prefers-reduced-motion:reduce){.ls-card{transform:none!important}.ls *,.ls *::before,.ls *::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}
`;