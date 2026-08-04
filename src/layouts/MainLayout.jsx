import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";

import "../styles/layout.css";

function MainLayout({ title, children }) {
  return (
    <div className="layout">

      <Sidebar />

      <div className="main-content">

        <Header title={title} />

        <div className="page-content">

          {children}

        </div>

      </div>

    </div>
  );
}

export default MainLayout;