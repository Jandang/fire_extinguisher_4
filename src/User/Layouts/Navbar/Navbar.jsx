import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import "./Navbar.css";


function Navbar() {
  const [tab, setTab] = useState("");
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/") {
      setTab("home");
    } else if (location.pathname === "/home") {
      setTab("home");
    } else if (location.pathname === "/profile") {
      setTab("profile");
    }
  }, [location]);

  return (
    <div className="navbar-container-user">
      <Link to="/">
        <span
          className="bi bi-house-door-fill home-icon"
          style={(tab === "home" ? { color: "#473366" } : { color: "#B3B4AD" })}
          onClick={() => setTab("home")}>
        </span>
      </Link>
      <Link to={"/scanqrcode"}>
        <button className="navbar-scan-button">
          <span
            className="bi bi-camera-fill scan-icon">
          </span>
        </button>
      </Link>
      <Link to="/profile">
        <span
          className="bi bi-person-fill profile-icon"
          style={(tab === "profile" ? { color: "#473366" } : { color: "#B3B4AD" })}
          onClick={() => setTab("profile")}></span>
      </Link>
    </div>
  );
}

export default Navbar;
