import dayjs from "dayjs";
import "dayjs/locale/id";

import "../../styles/header.css";

dayjs.locale("id");

function Header({ title }) {
  const today = dayjs().format("dddd, DD MMMM YYYY");

  return (
    <header className="header">

      <div className="header-left">

        <h2>{title}</h2>

      </div>

      <div className="header-right">

        <div className="header-date">
          {today}
        </div>

        <div className="header-user">

          <div className="avatar">
            A
          </div>

          <div className="user-info">

            <span className="user-name">
              Administrator
            </span>

            <span className="user-role">
              Admin
            </span>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Header;