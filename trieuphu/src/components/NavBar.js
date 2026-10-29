import { NavLink } from "react-router-dom";

function NavBar() {
  const getLinkStyle = ({ isActive }) => ({
    color: isActive ? "red" : "#333",
    fontWeight: isActive ? "bold" : "normal",
    textDecoration: "none",
    padding: "10px 14px"
  });

  return (
    <nav className="navbar">
      <NavLink to="/" end style={getLinkStyle}>
        Trang chủ
      </NavLink>

      <NavLink to="/questions" style={getLinkStyle}>
        Ngân hàng câu hỏi
      </NavLink>

      <NavLink to="/history" style={getLinkStyle}>
        Lịch sử
      </NavLink>
    </nav>
  );
}

export default NavBar;
