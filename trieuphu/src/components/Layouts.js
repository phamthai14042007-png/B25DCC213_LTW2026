import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = ({ history, onClearHistory }) => {
  return (
    <div className="app-container">
      <NavBar />
      <main className="main-content">
        <Outlet context={{ history, onClearHistory }} />
      </main>
    </div>
  );
};

export default Layout;
