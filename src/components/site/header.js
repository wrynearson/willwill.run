import { Link } from "react-router-dom";

function HeaderComponent(props) {
  return (
    <header className="header">
      <Link className="site-title" to="/">
        {props.title}
      </Link>
      <nav>
        <ul className="navigation">
          <li>
            {/* <Link className="nav-item" to="/about">
              About
            </Link> */}
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default HeaderComponent;
