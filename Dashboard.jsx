// src/pages/Dashboard.jsx
import { useMemo } from "react";
import { NavLink } from "react-router-dom";
import { useProfile } from "../context/ProfileContext.jsx";
import { useApplications } from "../context/ApplicationsContext.jsx";
import { useEvents } from "../context/EventsContext.jsx";

export default function Dashboard() {
  const { profile } = useProfile();
  const { apps } = useApplications();
  const { events } = useEvents();

  const members = useMemo(
    () => apps.filter(a => a.status === "Approved"),
    [apps]
  );
  const totalMembers = members.length;

  const completedEvents = useMemo(
    () =>
      events.filter(e => {
        const t = new Date(`${e.date}T${e.time || "00:00"}`).getTime();
        return t < Date.now();
      }).length,
    [events]
  );

  const upcomingEvents = useMemo(
    () =>
      events.filter(e => {
        const t = new Date(`${e.date}T${e.time || "00:00"}`).getTime();
        return t >= Date.now();
      }).length,
    [events]
  );

  const pending = useMemo(
    () => apps.filter(a => a.status === "Pending"),
    [apps]
  );
  const preview = pending.slice(0, 5);

  return (
    <div className="dash-wrap">
      <section className="card dash-hero">
        <div>
          <div className="subtle">Welcome back,</div>
          <h2 className="hero-title">{profile.name || "Officer"}</h2>
          <div className="hero-sub">{profile.position || "Officer"}</div>
        </div>
        <div className="hero-blob" aria-hidden />
      </section>

      <section className="dash-kpi-grid">
        <div className="stat-card">
          <div className="stat-title">Total Members</div>
          <div className="stat-body">
            <div className="kpi">{totalMembers}</div>
            <div className="kpi-note">Active members in your org</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-title">Events Overview</div>
          <div className="stat-body">
            <div className="kpi-block">
              <div className="kpi">{completedEvents}</div>
              <div className="kpi-note">Completed</div>
            </div>
            <div className="kpi-block">
              <div className="kpi">{upcomingEvents}</div>
              <div className="kpi-note">Upcoming</div>
            </div>
          </div>
        </div>
      </section>

      {/* PENDING PREVIEW */}
      <section className="card">
        <div className="table-head">
          <h3 className="section-title">Pending Application Requests</h3>
          <NavLink to="/applications" className="link">
            Open Applications
          </NavLink>
        </div>

        <div className="table">
          <div className="row head">
            <div className="col name">Name</div>
            <div className="col id">Student no.</div>
            <div className="col status">Status</div>
          </div>

          {preview.map(a => (
            <div className="row" key={a.id}>
              <div className="col name">{a.name}</div>
              <div className="col id">{a.studentNo}</div>
              <div className="col status">
                <span className="pill pill-pending">Pending</span>
              </div>
            </div>
          ))}

          {preview.length === 0 && (
            <div className="row">
              <div className="col name muted">No pending applications.</div>
            </div>
          )}
        </div>

        <div className="table-foot">
          <span className="muted">
            Showing {Math.min(5, pending.length)} of {pending.length}
          </span>
          <NavLink to="/applications" className="link">
            See all
          </NavLink>
        </div>
      </section>

      {/* ACTIONS below the card */}
      <div className="dash-actions">
        <NavLink to="/applications" className="btn pill">
          View Applications
        </NavLink>
        <NavLink to="/events" className="btn pill">
          Create Event
        </NavLink>
        <NavLink to="/members" className="btn pill">
          View Members
        </NavLink>
      </div>
    </div>
  );
}
