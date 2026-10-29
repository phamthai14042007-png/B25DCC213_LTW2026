import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

function Layout() {
  return (
    <div className="app-container">
      <NavBar />

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
