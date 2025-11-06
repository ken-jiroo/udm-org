// src/pages/Members.jsx
import { useMemo, useState } from "react";
import { useApplications } from "../context/ApplicationsContext.jsx";

export default function Members() {
  const { apps, revert } = useApplications();
  const [query, setQuery] = useState("");

  // Only Approved become "members"
  const members = useMemo(() => {
    const q = query.trim().toLowerCase();
    return apps
      .filter((a) => a.status === "Approved")
      .filter(
        (a) =>
          !q ||
          a.name.toLowerCase().includes(q) ||
          (a.studentNo || "").toLowerCase().includes(q)
      );
  }, [apps, query]);

  function onRevert(id) {
    if (
      confirm(
        "Set this member back to Pending?\nThey will be removed from the Members list and appear again in Applications."
      )
    ) {
      revert(id); // from ApplicationsContext.jsx
    }
  }

  return (
    <div className="card">
      <h2 className="section-title">Members</h2>

      <div className="table-toolbar">
        <input
          className="input"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or student no."
        />
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Student no.</th>
            <th>Status</th>
            <th style={{ width: 140, textAlign: "right" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.length === 0 ? (
            <tr>
              <td colSpan={4} style={{ textAlign: "center", padding: "24px" }}>
                No approved members.
              </td>
            </tr>
          ) : (
            members.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.studentNo}</td>
                <td>
                  <span className="tag success">Approved</span>
                </td>
                <td className="table-actions">
                  <button
                    className="btn-link danger"
                    onClick={() => onRevert(m.id)}
                    title="Move back to Pending"
                  >
                    Set to Pending
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
