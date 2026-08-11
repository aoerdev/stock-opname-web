import dayjs from "dayjs";
import "dayjs/locale/id";

import { Menu } from "lucide-react";

import useAuth from "../../hooks/useAuth";

import "../../styles/header.css";

dayjs.locale("id");

function Header({ title, onMenuClick }) {

  const { profile } = useAuth();

  const today =
    dayjs().format("dddd, DD MMMM YYYY");


  return (

    <header className="header">

      <div className="header-left">

        <button
          className="mobile-menu-btn"
          onClick={onMenuClick}
        >
          <Menu size={24} />
        </button>

        <h2>
          {title}
        </h2>

      </div>


      <div className="header-right">

        <div className="header-date">
          {today}
        </div>


        <div className="header-user">

          <div className="avatar">

            {profile?.nama
              ?.charAt(0)
              ?.toUpperCase() || "U"}

          </div>


          <div className="user-info">

            <span className="user-name">

              {profile?.nama ||
                "User"}

            </span>


            <span className="user-role">

              {profile?.role ||
                "user"}

            </span>

          </div>

        </div>

      </div>

    </header>

  );

}

export default Header;