import { useEffect, useMemo, useRef, useState } from "react";
import { useEvents } from "../context/EventsContext.jsx";

const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

export default function Events() {
  const { events, create, update, remove } = useEvents();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("create");
  const [editingId, setEditingId] = useState(null);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
    image: "",
  });
  const [error, setError] = useState("");

  // pagination: 3 per page
  const [page, setPage] = useState(1);
  const perPage = 3;

  // NEW: track which descriptions are expanded (by id)
  const [expanded, setExpanded] = useState({}); // { [id]: boolean }

  useEffect(() => {
    if (!open) {
      setForm({
        title: "",
        date: "",
        time: "",
        location: "",
        description: "",
        image: "",
      });
      setError("");
      setEditingId(null);
      setMode("create");
      if (fileRef.current) fileRef.current.value = "";
    }
  }, [open]);

  const sorted = useMemo(() => {
    return [...events].sort((a, b) => {
      const adt = new Date(`${a.date}T${a.time || "00:00"}`).getTime();
      const bdt = new Date(`${b.date}T${b.time || "00:00"}`).getTime();
      return adt - bdt;
    });
  }, [events]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const startIdx = (page - 1) * perPage;
  const pagedEvents = sorted.slice(startIdx, startIdx + perPage);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
    if (page < 1) setPage(1);
  }, [page, totalPages]);

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function onPickFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Please upload a JPG, PNG, WEBP, or GIF image.");
      fileRef.current.value = "";
      return;
    }

    if (file.size > MAX_BYTES) {
      setError("Image too large (max 2 MB).");
      fileRef.current.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, image: reader.result }));
    reader.readAsDataURL(file);
  }

  function onRemoveImage() {
    setForm((f) => ({ ...f, image: "" }));
    setError("");
    if (fileRef.current) fileRef.current.value = "";
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
      image: evt.image || "",
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
      const newTotalPages = Math.ceil((events.length + 1) / perPage);
      setPage(newTotalPages);
    } else {
      update(editingId, form);
    }
    setOpen(false);
  }

  function onDelete(id) {
    if (confirm("Delete this event?")) remove(id);
  }

  function nextPage() {
    if (page < totalPages) setPage(page + 1);
  }
  function prevPage() {
    if (page > 1) setPage(page - 1);
  }

  // NEW: toggle desc expansion for a given event id
  function toggleDesc(id) {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="card">
      <style>{`
  /* ========= MODAL SIZING & LAYOUT ========= */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,.35);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px; /* gutter so card doesn't touch edges */
    z-index: 999;
  }

  .modal-card {
    width: min(820px, 92vw);         /* wider, but responsive */
    max-height: 85vh;                /* don't exceed viewport */
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 12px 32px rgba(0,0,0,.18);
    display: flex;
    flex-direction: column;          /* header + scrollable body */
    overflow: hidden;
  }

  .modal-head {
    padding: 16px 20px;
    border-bottom: 1px solid #e8e8e8;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .modal-body {
    padding: 18px 20px;
    overflow: auto;                  /* scrolling happens here */
  }

  .modal-close {
    border: none;
    background: transparent;
    font-size: 22px;
    line-height: 1;
    cursor: pointer;
    color: #333;
  }

  /* ========= FORM GRID ========= */
  .form-grid {
    display: grid;
    grid-template-columns: 160px 1fr; /* label / field */
    gap: 12px 16px;
    align-items: start;
  }
  .form-grid > label {
    font-weight: 600;
    padding-top: 8px;
  }
  .form-grid input[type="text"],
  .form-grid input[type="date"],
  .form-grid input[type="time"],
  .form-grid textarea {
    width: 100%;
    box-sizing: border-box;
  }

  /* Textarea constraints */
  .form-grid textarea {
    min-height: 120px;
    resize: vertical; /* user can expand if needed */
    line-height: 1.35;
  }

  /* File input + preview */
  .upload-col { display: block; }
  .upload-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: flex-start;
  }
  .avatar-preview {
    max-width: 120px;
    max-height: 120px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid #e5e5e5;
  }
  .upload-actions { margin-top: 8px; }

  /* Buttons row at the bottom of the form */
  .actions-centered {
    grid-column: 1 / -1;
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 8px;
  }
  .btn-pill,
  .btn.pill {
    padding: 10px 16px;
    border-radius: 999px;
  }
  .btn-pill.cancel { background: #eee; }

  /* ========= EVENT CARD (from earlier) ========= */
  .event-card {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: auto;
    min-height: 320px;
    box-sizing: border-box;
  }
  .event-body { flex-grow: 1; }
  .event-row { display: block; margin-bottom: 0.5rem; }

  .event-desc{
    display:-webkit-box;
    -webkit-line-clamp:3;
    -webkit-box-orient:vertical;
    overflow:hidden;
    line-height: 1.4;
    word-break: break-word;
  }
  .event-desc.expanded{
    display:block;
    overflow:visible;
    -webkit-line-clamp:initial;
    -webkit-box-orient:initial;
  }
  .desc-toggle{
    display:inline-block;
    margin-top:4px;
    background:none;
    border:none;
    cursor:pointer;
    color:#2a6db0;
    font-weight:600;
    font-size:.9rem;
    line-height:1.2;
    transition:color .2s;
  }
  .desc-toggle:hover{ text-decoration:underline; color:#174c80; }
  .event-actions{ margin-top:auto; padding-top:.5rem; }

  /* ========= RESPONSIVE ========= */
  @media (max-width: 720px) {
    .form-grid { grid-template-columns: 1fr; }
    .form-grid > label { padding-top: 0; }
  }
`}</style>



      <h2 className="section-title">Upcoming Events</h2>

      <div className="events-grid">
        {pagedEvents.length ? (
          pagedEvents.map((e) => {
            const isOpen = !!expanded[e.id];
            return (
              <article key={e.id} className="event-card">
                {e.image && (
                  <img src={e.image} alt={e.title} className="event-image" />
                )}

                <h3 className="event-title">{e.title}</h3>

                <div className="event-body">
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

                  <div className="event-row" style={{ display: "block" }}>
                    <strong>Description:</strong>&nbsp;
                    <span className={`event-desc ${isOpen ? "expanded" : ""}`}>
                      {e.description || "—"}
                    </span>
                    {/* Show toggle only when there is some description */}
                    {e.description && e.description.trim().length > 0 && (
                      <button
                        type="button"
                        className="desc-toggle"
                        onClick={() => toggleDesc(e.id)}
                      >
                        {isOpen ? "Show less" : "Show more"}
                      </button>
                    )}
                  </div>
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
            );
          })
        ) : (
          <p style={{ width: "100%", textAlign: "center" }}>
            No events found on this page.
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pager-bar">
          <button className="pager-btn" onClick={prevPage} disabled={page === 1}>
            ‹ Prev
          </button>
          <span style={{ margin: "0 10px" }}>
            Page {page} of {totalPages}
          </span>
          <button
            className="pager-btn"
            onClick={nextPage}
            disabled={page === totalPages}
          >
            Next ›
          </button>
        </div>
      )}

      <div className="events-toolbar">
        <button className="btn pill" onClick={onCreateOpen}>
          Create New Event
        </button>
      </div>

      {open && (
        <Modal
          onClose={() => setOpen(false)}
          title={mode === "create" ? "Create Event" : "Edit Event"}
        >
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
            <input type="time" name="time" value={form.time} onChange={onChange} />

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

            <label>Event Image</label>
            <div className="upload-col">
              <div className="upload-row">
                <input
                  ref={fileRef}
                  type="file"
                  accept={ALLOWED_TYPES.join(",")}
                  onChange={onPickFile}
                />
                {form.image && (
                  <img src={form.image} alt="Preview" className="avatar-preview" />
                )}
              </div>
              {error && <div className="error">{error}</div>}
              <div className="upload-actions">
                <button
                  type="button"
                  className="btn pill"
                  onClick={onRemoveImage}
                  disabled={!form.image}
                >
                  Remove Image
                </button>
              </div>
            </div>

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
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
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
