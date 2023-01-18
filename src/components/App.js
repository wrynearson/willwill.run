import React from "react";
import { allRuns } from "../data";

export default function App() {
  const runs = allRuns.map(function (run, index) {
    return <li key={run.id}>{run.label}</li>;
  });

  return (
    <div>
      <ul>{runs}</ul>
    </div>
  );
}
