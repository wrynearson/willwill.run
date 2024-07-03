import React from "react";
import { Link } from "react-router-dom";
import HeaderComponent from "../components/site/header";

function About() {
  return (
    <div>
      <HeaderComponent title="Will will run" />
      <h1>About</h1>
      <p>This is a website.</p>
    </div>
  );
}

export default About;
