import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  return (
    <div className="card">
      <h1 className="welcome">Welcome, Mark Adrian Remigio</h1>
      <div className="placeholder-panel" />
      <div className="actions">
        <button className="btn pill" onClick={() => navigate("/applications")}>View Applications</button>
        <button className="btn pill" onClick={() => navigate("/events")}>Create Event</button>
        <button className="btn pill" onClick={() => navigate("/members")}>View Members</button>
      </div>
    </div>
  );
}
