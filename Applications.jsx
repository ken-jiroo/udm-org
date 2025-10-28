import { useMemo, useState } from "react";
import { useApplications } from "../context/ApplicationsContext.jsx";

export default function Applications() {
  const { applications, approve, reject } = useApplications();
  const [selected, setSelected] = useState(null);
  const [viewerOpen, setViewerOpen] = useState(false);

  const rows = useMemo(() => applications, [applications]);

  function onRowClick(id) {
    setSelected((cur) => (cur === id ? null : id));
  }

  function doApprove() {
    if (!selected) return alert("Select an application first.");
    approve(selected);
  }

  function doReject() {
    if (!selected) return alert("Select an application first.");
    reject(selected);
  }

  function openViewer() {
    if (!selected) return alert("Select an application first.");
    setViewerOpen(true);
  }

  const selectedRow = rows.find((r) => r.id === selected);

  return (
    <div className="card">
      <h2 className="section-title">Application Requests</h2>

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Student no.</th>
              <th>Email</th>
              <th>Status</th>
              <th style={{ width: 120 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 18 }}>
                  No applications.
                </td>
              </tr>
            )}
            {rows.map((r) => (
              <tr
                key={r.id}
                className={selected === r.id ? "is-selected" : ""}
                onClick={() => onRowClick(r.id)}
              >
                <td>{r.name}</td>
                <td>{r.studentNo}</td>
                <td>{r.email}</td>
                <td>
                  <StatusBadge status={r.status} />
                </td>
                <td>
                  <div className="row-actions">
                    <button
                      className="btn-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        approve(r.id);
                      }}
                    >
                      Approve
                    </button>
                    <button
                      className="btn-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        reject(r.id);
                      }}
                    >
                      Reject
                    </button>
                    <button
                      className="btn-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelected(r.id);
                        setViewerOpen(true);
                      }}
                    >
                      View ID
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer actions (no upload button) */}
      <div className="apps-footer-actions">
        <button className="btn pill" onClick={doApprove}>
          Approve
        </button>
        <button className="btn pill" onClick={doReject}>
          Reject
        </button>
        <button className="btn pill" onClick={openViewer}>
          View ID (Attachment)
        </button>
      </div>

      {viewerOpen && (
        <IdViewer onClose={() => setViewerOpen(false)} row={selectedRow} />
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    Approved: { bg: "#daf5d7", bd: "#b7e3b2", fg: "#2d6a2d" },
    Rejected: { bg: "#fde4e4", bd: "#f2c0c0", fg: "#8b1d1d" },
    Pending: { bg: "#eef2f6", bd: "#d7dee5", fg: "#374151" },
  };
  const s = map[status] || map.Pending;
  return (
    <span
      style={{
        background: s.bg,
        color: s.fg,
        border: `1px solid ${s.bd}`,
        borderRadius: 999,
        padding: "2px 10px",
        fontSize: 13,
      }}
    >
      {status}
    </span>
  );
}

function IdViewer({ row, onClose }) {
  if (!row) return null;
  const dataUrl = row.idAttachment;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h3>{row.name} — ID Attachment</h3>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="modal-body">
          {!dataUrl && <p>No attachment uploaded yet.</p>}

          {dataUrl && dataUrl.startsWith("data:image") && (
            <img
              src={dataUrl}
              alt="ID Attachment"
              style={{
                maxWidth: "100%",
                borderRadius: 10,
                border: "1px solid #e2e6ea",
              }}
            />
          )}

          {dataUrl && dataUrl.startsWith("data:application/pdf") && (
            <iframe
              title="ID PDF"
              src={dataUrl}
              style={{
                width: "100%",
                height: 480,
                border: "1px solid #e2e6ea",
                borderRadius: 10,
              }}
            />
          )}
        </div>

        <div className="actions-centered">
          <button className="btn-pill cancel" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
