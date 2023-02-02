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
  let runsSorted = runs.sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? -1 : 0
  );

  // this works to change the order by date, but it's mutable...
  let runsSorted2 = allRuns.sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0
  );

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
  console.log("runsSorted2: ", runsSorted2);

  return (
    <div>
      <ul>{runs}</ul>
      <ol>{runsSorted}</ol>
      <ul>{testing}</ul>
      {runsSorted}
    </div>
  );
}
