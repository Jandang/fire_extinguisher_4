import { Outlet } from "react-router-dom";
// import Navbar from "../Navbar/Navbar";
import Header from "../Header/Header";
import Footer from "../Footer/Footer";
import "./Layout.css";

function Layout() {
  // const location = useLocation();
  // const hideNavbarPaths = ['/fire-details/', '/notifications', '/check-extinguisher', '/scanqrcode',];

  // const showNavbar = !hideNavbarPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="layout-container">
      <Header />
        <span className="layout-main">
          <Outlet />
        </span>
        {/* <span className="layout-navbar">
          {showNavbar && <Navbar />}
        </span> */}
      
      <Footer />
    </div>
  );
}

export default Layout;
