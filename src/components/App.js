import React, { useState } from "react";
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
  const [selectedRunId, setSelectedRunId] = useState();
  console.log("🚀 ~ file: App.js:17 ~ App ~ selectedRunId:", selectedRunId);

  const orderNew = order === "asc" ? "desc" : "asc";

  console.log("order is ", order, ", newOrder is ", orderNew);

  // trying to copy allRuns without mutating it
  const runsSorted = sortRunsByDate(allRuns, order);

  const selectedRun = runsSorted.find(function (run) {
    return run.id === selectedRunId;
  });

  const notSelectedRuns = runsSorted.filter(function (notRuns) {
    return notRuns.id !== selectedRunId;
  });

  console.log("selectedRun is:", selectedRun);
  console.log("non-selected runs are", notSelectedRuns);

  return (
    <>
      <HeaderComponent title="Will will run" menu1="runs" menu2="about" />
      <div className="body">
        <div className="runs-block">
          <RunSelector title="Past Runs" />
          <div className="run-filters">
            <p>Sort By</p>
            <p>Sort Order</p>
          </div>
          <RunCard title="Run Title" />
          <RunCard title="Run Title 2" />
          <RunCard title="Run Title 3" />
        </div>
        <p className="map-block">Map will go here!</p>
      </div>
      <div className="background-box">
        <div>
          <button
            className="button-primary"
            onClick={() => {
              console.log("click");
              setOrder(orderNew);
            }}
          >
            Change order to {orderNew}ending
          </button>
          <RunsOrderedList
            runs={runsSorted}
            runSelected={selectedRunId}
            selectRun={setSelectedRunId}
          />
          {selectedRunId ? (
            <div className="selected-runs-section">
              <p>Selected run title: {selectedRun.label}</p>
              <p>Selected run id: {selectedRun.id}</p>
              <p>Selected run date: {selectedRun.date}</p>
            </div>
          ) : (
            <p>no run selected</p>
          )}
          {selectedRunId ? (
            <div>
              <h4>The following runs are not selected:</h4>
              <ul>
                {notSelectedRuns.map((notSelectedRun) => (
                  <li key={notSelectedRun.id}>{notSelectedRun.label}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
      <div className="footer">
        <FooterComponent className="footer" copyright="Some copyright 2023" />
      </div>
    </>
  );
}

function RunsOrderedList(props) {
  return (
    <ol>
      {props.runs.map(function (run) {
        return (
          <ItemRendering
            key={run.id}
            id={run.id}
            label={run.label}
            date={run.date}
            runSelected={props.runSelected}
            selectRun={props.selectRun}
          />
        );
      })}
    </ol>
  );
}

function ItemRendering(props) {
  return (
    <li className="run-list">
      <a
        className="run-link"
        href="https://developmentseed.org"
        onClick={(e) => {
          e.preventDefault();
          // console.log("run selected before clicking: ", props.runSelected.id);
          console.log("clicked run ID: ", props.id);
          props.selectRun(props.id);
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
    <header className="header">
      <h1 className="site-title">{props.title}</h1>
      <nav class="navigation">
        <a className="nav-item" href="/">
          {props.menu1}
        </a>
        <a className="nav-item" href="/">
          {props.menu2}
        </a>
      </nav>
    </header>
  );
}

function RunCard(props) {
  return (
    <div className="run-cards">
      <p>{props.title}</p>
    </div>
  );
}

function FooterComponent(props) {
  return <p className="copyright">{props.copyright}</p>;
}

function RunSelector(props) {
  return (
    <>
      <h2>{props.title}</h2>
    </>
  );
}
