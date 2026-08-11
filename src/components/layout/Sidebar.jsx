import { NavLink, useNavigate } from "react-router-dom";

import {
  LayoutDashboard,
  Package,
  FileSpreadsheet,
  ClipboardList,
  Download,
  Users,
  LogOut,
  X
} from "lucide-react";

import useAuth from "../../hooks/useAuth";
import authService from "../../services/authService";

import "../../styles/sidebar.css";


const menus = [

  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
    roles: ["admin", "user"],
  },

  {
    title: "Master Barang",
    path: "/master-barang",
    icon: Package,
    roles: ["admin"],
  },

  {
    title: "Import Barang",
    path: "/import-barang",
    icon: FileSpreadsheet,
    roles: ["admin"],
  },

  {
    title: "Stock Opname",
    path: "/stock-opname",
    icon: ClipboardList,
    roles: ["admin", "user"],
  },

  {
    title: "Export",
    path: "/export",
    icon: Download,
    roles: ["admin"],
  },

  {
    title: "User Management",
    path: "/user-management",
    icon: Users,
    roles: ["admin"],
  },

];


function Sidebar({ isOpen, onClose }) {

  const navigate = useNavigate();

  const { profile } = useAuth();

  const role = profile?.role ?? "user";


  async function handleLogout() {

    const { error } =
      await authService.logout();


    if (!error) {

      navigate("/login");

    }

  }


  return (

    <aside
      className={`sidebar ${isOpen ? "sidebar-open" : ""
        }`}
    >

      <div className="sidebar-logo">

        <h2>
          📦 Stock Opname
        </h2>


        <button
          className="sidebar-close-btn"
          onClick={onClose}
        >
          <X size={24} />
        </button>

      </div>


      <nav className="sidebar-menu">

        {menus

          .filter((menu) =>
            menu.roles.includes(role)
          )

          .map((menu) => {

            const Icon = menu.icon;


            return (

              <NavLink
                key={menu.path}
                to={menu.path}
                onClick={onClose}
                className={({ isActive }) =>
                  isActive
                    ? "menu active"
                    : "menu"
                }
              >

                <Icon size={20} />

                <span>
                  {menu.title}
                </span>

              </NavLink>

            );

          })}


        <div className="sidebar-footer">

          <button
            className="logout-btn"
            onClick={handleLogout}
          >

            <LogOut size={20} />

            <span>
              Logout
            </span>

          </button>

        </div>

      </nav>

    </aside>

  );

}


export default Sidebar;