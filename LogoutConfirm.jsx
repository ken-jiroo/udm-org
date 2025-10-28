import { useNavigate } from "react-router-dom";

export default function LogoutConfirm() {
  const navigate = useNavigate();
  return (
    <div className="card card-centered">
      <div className="big-text">Are you sure you want to log out?</div>
      <div className="logout-actions">
        <button className="logout-yes" onClick={() => navigate("/goodbye")}>Yes, Logout</button>
        <button className="logout-cancel" onClick={() => navigate("/dashboard")}>Cancel</button>
      </div>
    </div>
  );
}
