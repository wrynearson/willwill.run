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
  // set default state
  const [selectedRun, setSelectedRun] = useState("no run selected");

  const orderNew = order === "asc" ? "desc" : "asc";

  console.log("order is ", order, ", newOrder is ", orderNew);

  // trying to copy allRuns without mutating it
  const runsSorted = sortRunsByDate(allRuns, order);

  return (
    <div>
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
        <RunsOrderedList
          runs={runsSorted}
          // testing passing props around :)
          hello="hello"
          runSelected={selectedRun}
          selectRun={setSelectedRun}
        />
      </div>
    </div>
  );
}

function RunsOrderedList(props) {
  return (
    <div>
      <p>Selected run: {props.runSelected}</p>
      <ol>
        {props.runs.map(function (run) {
          return (
            <ItemRendering
              key={run.id}
              id={run.id}
              label={run.label}
              date={run.date}
              // testing this again :)
              hello={props.hello}
              runSelected={props.runSelected}
              selectRun={props.selectRun}
            />
          );
        })}
      </ol>
    </div>
  );
}

function ItemRendering(props) {
  return (
    <li>
      <a
        href="https://developmentseed.org"
        onClick={(e) => {
          e.preventDefault();
          console.log("testing: ", props.hello);
          console.log("run selected before clicking: ", props.runSelected);
          console.log("clicked run ID: ", props.id);
          props.selectRun(props.id);
          // this is undefined for some reason...
          console.log("newly selected run: ", props.selectRun);
        }}
      >
        {props.label}
      </a>
      , {props.date}
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
