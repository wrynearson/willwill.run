import React from "react";
import { allRuns } from "../data";

export default function App() {
  const runs = allRuns.map(function (run, index) {
    return (
      <li key={run.id}>
        {run.label}, {run.date}
      </li>
    );
  });

  // trying to copy allRuns without mutating it
  const runsSorted = runs.sort(function (a, b) {
    return b.date - a.date;
  });

  // testing if my sort function logic works
  let testing = [1, 4, -5, 6, 89].sort(function (a, b) {
    return a - b;
  });

  // testing if I can iterate over items in testing and allRuns
  testing.forEach((test) => console.log(test));
  allRuns.forEach((id) => console.log(id.date));

  // seeing what's passed to the browser
  console.log("allRuns: ", allRuns);
  console.log("runsSorted: ", runsSorted);

  return (
    <div>
      <ul>{runs}</ul>
      <ol>{runsSorted}</ol>
      <ul>{testing}</ul>
    </div>
  );
}
