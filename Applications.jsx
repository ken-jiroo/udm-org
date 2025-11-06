// src/pages/Applications.jsx
import { useEffect, useMemo, useState } from "react";
import { useApplications } from "../context/ApplicationsContext.jsx";

export default function Applications() {
  const { apps, approve, reject } = useApplications();

  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // 🔢 Pagination state (default 5 per page)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // default = 5

  // Filter by search
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return apps;
    return apps.filter((a) => {
      return (
        (a.name || "").toLowerCase().includes(q) ||
        (a.studentNo || "").toLowerCase().includes(q) ||
        (a.email || "").toLowerCase().includes(q) ||
        (a.status || "").toLowerCase().includes(q)
      );
    });
  }, [apps, query]);

  // Reset to page 1 when search or pageSize changes
  useEffect(() => {
    setPage(1);
  }, [query, pageSize]);

  // Compute current page slice
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const startIdx = (clampedPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, total);
  const paged = filtered.slice(startIdx, endIdx);

  // Selected row reference (prefer what’s visible; fallback to anywhere in filtered)
  const selected =
    paged.find((r) => r.id === selectedId) ||
    filtered.find((r) => r.id === selectedId) ||
    null;

  const canAct = Boolean(selectedId);

  const onRowClick = (id) => {
    setSelectedId((prev) => (prev === id ? null : id));
  };

  const onApprove = () => {
    if (!selectedId) return;
    approve(selectedId);
    // keep selection; page will auto-jump via useEffect below
  };

  const onReject = () => {
    if (!selectedId) return;
    reject(selectedId);
    // keep selection; page will auto-jump via useEffect below
  };

  const goTo = (p) => setPage(Math.min(Math.max(1, p), totalPages));

  // ✅ Auto-jump to the page that contains the selected row whenever data/search/pagesize change
  useEffect(() => {
    if (!selectedId) return;
    const idxInFiltered = filtered.findIndex((a) => a.id === selectedId);
    if (idxInFiltered === -1) return; // filtered out by search
    const targetPage = Math.floor(idxInFiltered / pageSize) + 1;
    if (targetPage !== page) {
      setPage(targetPage);
    }
  }, [filtered, selectedId, pageSize, page]);

  const renderPageNumbers = () => {
    const windowSize = 5;
    let start = Math.max(1, clampedPage - Math.floor(windowSize / 2));
    let end = Math.min(totalPages, start + windowSize - 1);
    start = Math.max(1, end - windowSize + 1);

    const nums = [];
    for (let i = start; i <= end; i++) {
      nums.push(
        <button
          key={i}
          className={`pager-btn ${i === clampedPage ? "is-current" : ""}`}
          onClick={() => goTo(i)}
          aria-current={i === clampedPage ? "page" : undefined}
        >
          {i}
        </button>
      );
    }
    return nums;
  };

  return (
    <div className="card">
      <div className="card-header">
        <h2>Application Requests</h2>

        <div className="searchbar-wrap" style={{ gap: 8 }}>
          <input
            className="input"
            placeholder="Search name, student no., email or status"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {/* Page size selector (defaults to 5) */}
          <select
            className="input"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            aria-label="Rows per page"
            style={{ width: 110 }}
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={20}>20 / page</option>
          </select>
        </div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: "28%" }}>Name</th>
              <th style={{ width: "16%" }}>Student no.</th>
              <th style={{ width: "28%" }}>Email</th>
              <th style={{ width: "12%" }}>Status</th>
              <th style={{ width: "16%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: "24px" }}>
                  {total === 0 ? "No application requests found." : "No results on this page."}
                </td>
              </tr>
            ) : (
              paged.map((r) => {
                const isSelected = r.id === selectedId;
                return (
                  <tr
                    key={r.id}
                    className={`clickable ${isSelected ? "row-selected" : ""}`}
                    onClick={() => onRowClick(r.id)}
                  >
                    <td>{r.name}</td>
                    <td>{r.studentNo || "—"}</td>
                    <td>{r.email}</td>
                    <td>
                      {r.status === "Approved" && (
                        <span className="badge badge-success">Approved</span>
                      )}
                      {r.status === "Rejected" && (
                        <span className="badge badge-danger">Rejected</span>
                      )}
                      {r.status !== "Approved" && r.status !== "Rejected" && (
                        <span className="badge">Pending</span>
                      )}
                    </td>
                    <td>
                      <div className="btn-row">
                        <button
                          className="btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            approve(r.id);
                            setSelectedId(r.id); // keep selection
                          }}
                        >
                          Approve
                        </button>
                        <button
                          className="btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            reject(r.id);
                            setSelectedId(r.id); // keep selection
                          }}
                        >
                          Reject
                        </button>
                        <button
                          className="btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (r.idAttachment) {
                              window.open(r.idAttachment, "_blank", "noopener");
                            } else {
                              alert("No ID attachment for this applicant.");
                            }
                          }}
                        >
                          View ID
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination bar */}
      <div className="pager-bar">
        <div className="pager-left">
          <span className="muted">
            Showing <strong>{total === 0 ? 0 : startIdx + 1}</strong>–<strong>{endIdx}</strong> of{" "}
            <strong>{total}</strong>
          </span>
        </div>

        <div className="pager-right">
          <button className="pager-btn" onClick={() => goTo(1)} disabled={clampedPage === 1}>
            « First
          </button>
          <button className="pager-btn" onClick={() => goTo(clampedPage - 1)} disabled={clampedPage === 1}>
            ‹ Prev
          </button>

          {renderPageNumbers()}

          <button className="pager-btn" onClick={() => goTo(clampedPage + 1)} disabled={clampedPage === totalPages}>
            Next ›
          </button>
          <button className="pager-btn" onClick={() => goTo(totalPages)} disabled={clampedPage === totalPages}>
            Last »
          </button>
        </div>
      </div>

      <div className="form-actions">
        <button className="btn" disabled={!canAct} onClick={onApprove}>
          Approve
        </button>
        <button className="btn" disabled={!canAct} onClick={onReject}>
          Reject
        </button>
        <button
          className="btn"
          disabled={!selected || !selected.idAttachment}
          onClick={() =>
            selected?.idAttachment && window.open(selected.idAttachment, "_blank", "noopener")
          }
        >
          View ID (Attachment)
        </button>
        <div className="muted" style={{ marginLeft: "auto" }}>
          {selected ? `Selected: ${selected.name} (${selected.status})` : "No selection"}
        </div>
      </div>
    </div>
  );
}
