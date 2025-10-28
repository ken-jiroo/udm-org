import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useProfile } from "../context/ProfileContext.jsx";

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { profile } = useProfile(); // <— pull from context

  const pageTitle = pathname.includes("/events")
    ? "Organization Events"
    : pathname.includes("/members")
    ? "Member List"
    : pathname.includes("/logout") || pathname.includes("/goodbye")
    ? "Logout Confirmation"
    : "Officer Dashboard";

  return (
    <div className="page-wrap">
      <header className="topbar">
        <div className="topbar-left">
          <div className="logo">logo</div>
          <div className="product-title">{pageTitle}</div>
        </div>
        <nav className="topnav">
          <a href="#home">Home</a>
          <a href="#organization">Organization</a>
          <a href="#testimonials">Testimonials</a>
          <button className="btn login-btn" onClick={() => navigate("/dashboard")}>
            Login
          </button>
        </nav>
      </header>

      <div className="content-shell">
        <aside className="sidebar">
          <div className="profile-card">
            <div className="avatar">
              {profile.avatar && (
                <img src={profile.avatar} alt="Profile" className="avatar-img" />
              )}
            </div>
            <div className="profile-lines">
              <div className="profile-line">
                <strong>Officer:</strong>&nbsp;{profile.position}
              </div>
              <div className="profile-line">
                <strong>Organization:</strong>&nbsp;{profile.organization}
              </div>
            </div>
          </div>

          <nav className="side-nav">
            <NavLink to="/dashboard" className={({isActive}) => `item ${isActive ? "active" : ""}`}>Dashboard</NavLink>
            <NavLink to="/applications" className={({isActive}) => `item ${isActive ? "active" : ""}`}>Applications</NavLink>
            <NavLink to="/members" className={({isActive}) => `item ${isActive ? "active" : ""}`}>Members</NavLink>
            <NavLink to="/events" className={({isActive}) => `item ${isActive ? "active" : ""}`}>Events</NavLink>
            <NavLink to="/profile" className={({isActive}) => `item ${isActive ? "active" : ""}`}>Profile Settings</NavLink>
            <NavLink to="/logout" className={({isActive}) => `item ${isActive ? "active" : ""}`}>Logout</NavLink>
          </nav>
        </aside>

        <main className="main-panel">
          <Outlet />
        </main>
      </div>

      <footer className="footer">
        <div className="footer-inner">
          <span className="brand">UDM OrgCentral</span>
          <span className="copy">© 2025</span>
        </div>
      </footer>
    </div>
  );
}
