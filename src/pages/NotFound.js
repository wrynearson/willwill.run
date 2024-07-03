import React from "react";
import { Link } from "react-router-dom";
import HeaderComponent from "../components/site/header";

function NotFound() {
  return (
    <div>
      <HeaderComponent title="Will will run" />
      <h1>Page not found!</h1>
      <Link to="/"> Go home</Link>
    </div>
  );
}

export default NotFound;
