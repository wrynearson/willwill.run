function HeaderComponent(props) {
  return (
    <header className="header">
      <h1 className="site-title">{props.title}</h1>
      <nav>
        <ul className="navigation">
          <li>
            <a className="nav-item" href="#runs">
              Runs
            </a>
          </li>
          <li>
            <a className="nav-item" href="about">
              About
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default HeaderComponent;
