import React, { useEffect, useState } from "react";
import { allRuns } from "../data";

function sortRunsByDate(list, order = "asc") {
  const order2 = order === "asc" ? -1 : order === "desc" ? 1 : 0;
  // list [run, run, run] -- run: { id, label, date }
  const listSorted = [...list].sort((a, b) =>
    a.date > b.date ? -1 * order2 : a.date < b.date ? 1 * order2 : 0
  );
  return listSorted;
}

export default function App() {
  const [order, setOrder] = useState("asc");

  const orderNew =
    order === "asc" ? "desc" : order === "desc" ? "asc" : "error";

  console.log("order is ", order, ", newOrder is ", orderNew);

  // trying to copy allRuns without mutating it
  const runsSorted = sortRunsByDate(allRuns, order);

  return (
    <div>
      <HeaderComponent title="My list of runs" desc="By Will" />
      <button
        onClick={() => {
          console.log("click");
          setOrder(orderNew);
        }}
      >
        Change order to {orderNew}ending
      </button>

      <RunsOrderedList runs={runsSorted} />
    </div>
  );
}

function RunsOrderedList(props) {
  return (
    <ol>
      {props.runs.map(function (run) {
        return <ItemRendering key={run.id} label={run.label} date={run.date} />;
      })}
    </ol>
  );
}

function ItemRendering(props) {
  return (
    <li>
      {props.label}, {props.date}
    </li>
  );
}

function HeaderComponent(props) {
  return (
    <div>
      <h1>{props.title}</h1>
      <p>{props.desc}</p>
    </div>
  );
}
