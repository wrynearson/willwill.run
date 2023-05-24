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
      <body>
        <HeaderComponent title="Will will run" menu1="runs" menu2="about" />
        <div className="body-content">
          <div className="runs-block">
            <RunSelector title="Past Runs" />
            <div className="run-filters">
              <p>Sort By</p>
              <select className="sort-by-select" name="by">
                <option value="1">Name</option>
                <option value="2">Date</option>
                <option value="3">Distance</option>
              </select>
              <p>Sort Order </p>
              <select className="sort-order-select">
                <option value="1">Ascending</option>
                <option value="2">Descending</option>
              </select>
            </div>
            <RunCard title="Run Title" date="2023-1-2" distance="1" />
            <RunCard title="Run Title 2" date="2022-2-3" distance="10" />
            <RunCard title="Run Title 3" date="2021-1-2" distance="100" />
            <RunCard title="Run Title 4" date="2020-1-2" distance="1000" />
          </div>
          <p className="map-block">Map will go here!</p>
        </div>
        <div>
          <p className="copyright">Some copyright 2023</p>
        </div>
      </body>
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
    <a href="/" className="run-cards">
      <img
        className="run-thumbnail"
        src="https://placehold.co/100x75"
        alt="Placeholder"
        width="100"
        height="75"
      ></img>
      <div className="run-attributes">
        <h3 class="run-name">{props.title}</h3>
        <h4 class="run-date">on {props.date}</h4>
      </div>
      <div className="run-distance">{props.distance}K</div>
    </a>
  );
}

function RunSelector(props) {
  return <h2 className="runs-block-title">{props.title}</h2>;
}
