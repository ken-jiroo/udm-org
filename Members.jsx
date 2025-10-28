export default function Members() {
  return (
    <div className="card">
      <h2 className="section-title centered">Registered Members</h2>

      <div className="search-bar">
        <input placeholder="Search members" />
        <div className="search-icon" aria-hidden>🔍</div>
      </div>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Student No.</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 6 }).map((_, i) => (
              <tr key={i}><td></td><td></td><td></td><td></td></tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="actions">
        <button className="btn pill">Add Member (manual)</button>
        <button className="btn pill">Remove Member</button>
      </div>
    </div>
  );
}
