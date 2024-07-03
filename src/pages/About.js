import React from "react";
import { Link } from "react-router-dom";
import HeaderComponent from "../components/site/header";

function About() {
  return (
    <>
      <HeaderComponent title="Will will run" />
      <div className="runs-block">
        <h2 className="runs-block-title">About</h2>
        <p>
          This is a website. More information can be found{" "}
          <a href="https://github.com/wrynearson/willwill.run">here</a>.
        </p>
      </div>
    </>
  );
}

export default About;
