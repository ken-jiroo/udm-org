import { useEffect, useMemo, useState } from "react";
import { useEvents } from "../context/EventsContext.jsx";

export default function Events() {
  const { events, create, update, remove } = useEvents();

  // Modal state
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create"); // "create" | "edit"
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  });

  useEffect(() => {
    if (!open) {
      // Reset when closing
      setForm({ title: "", date: "", time: "", location: "", description: "" });
      setEditingId(null);
      setMode("create");
    }
  }, [open]);

  const sorted = useMemo(
    () =>
      [...events].sort((a, b) => {
        const adt = new Date(`${a.date}T${a.time || "00:00"}`).getTime();
        const bdt = new Date(`${b.date}T${b.time || "00:00"}`).getTime();
        return adt - bdt;
      }),
    [events]
  );

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function onCreateOpen() {
    setMode("create");
    setOpen(true);
  }

  function onEditOpen(evt) {
    setMode("edit");
    setEditingId(evt.id);
    setForm({
      title: evt.title,
      date: evt.date,
      time: evt.time,
      location: evt.location,
      description: evt.description,
    });
    setOpen(true);
  }

  function onSubmit(e) {
    e.preventDefault();
    if (!form.title || !form.date) {
      alert("Please enter at least Title and Date.");
      return;
    }
    if (mode === "create") {
      create(form);
    } else {
      update(editingId, form);
    }
    setOpen(false);
  }

  function onDelete(id) {
    if (confirm("Delete this event?")) remove(id);
  }

  return (
    <div className="card">
      <h2 className="section-title">Upcoming Events</h2>

      <div className="events-grid">
        {sorted.map((e) => (
          <article key={e.id} className="event-card">
            <h3 className="event-title">{e.title}</h3>

            <div className="event-row">
              <strong>Date:</strong>&nbsp;
              {new Date(e.date).toLocaleDateString(undefined, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>

            <div className="event-row">
              <strong>Time:</strong>&nbsp;{formatTime(e.time)}
            </div>

            <div className="event-row">
              <strong>Location:</strong>&nbsp;{e.location || "—"}
            </div>

            <div className="event-row">
              <strong>Description:</strong>&nbsp;{e.description || "—"}
            </div>

            <div className="event-actions">
              <button className="btn pill" onClick={() => onEditOpen(e)}>
                Edit Event
              </button>
              <button className="btn pill" onClick={() => onDelete(e.id)}>
                Delete Event
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="events-toolbar">
        <button className="btn pill" onClick={onCreateOpen}>
          Create New Event
        </button>
      </div>

      {open && (
        <Modal onClose={() => setOpen(false)} title={mode === "create" ? "Create Event" : "Edit Event"}>
          <form className="form-grid" onSubmit={onSubmit}>
            <label>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="Event title"
              required
            />

            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={onChange}
              required
            />

            <label>Time</label>
            <input
              type="time"
              name="time"
              value={form.time}
              onChange={onChange}
            />

            <label>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={onChange}
              placeholder="Where is it?"
            />

            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="What’s happening?"
              rows={3}
            />

           {/* Centered Buttons */}
<div className="actions-centered">
  <button className="btn-pill" type="submit">
    {mode === "create" ? "Create Event" : "Save Changes"}
  </button>
  <button
    className="btn-pill cancel"
    type="button"
    onClick={() => setOpen(false)}
  >
    Cancel
  </button>
</div>
          </form>
        </Modal>
      )}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  // Simple inline modal—no portals needed
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

function formatTime(t) {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  const hour12 = ((h + 11) % 12) + 1;
  const ampm = h < 12 ? "AM" : "PM";
  return `${hour12}:${m.toString().padStart(2, "0")} ${ampm}`;
}
