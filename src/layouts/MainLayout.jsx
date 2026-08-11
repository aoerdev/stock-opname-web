import { useState } from "react";

import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

import "../styles/layout.css";

function MainLayout({ title, children }) {

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (

    <div className="layout">

      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="main-content">

        <Header
          title={title}
          onMenuClick={() =>
            setSidebarOpen(true)
          }
        />

        <div className="page-content">

          {children}

        </div>

      </div>

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

    </div>

  );

}

export default MainLayout;