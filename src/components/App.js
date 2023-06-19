import React, { useState } from "react";
import { allRuns } from "../data";

function sortRunsByDate(list, order = "asc", sortBy = "date") {
  const ordered = order === "asc" ? -1 : order === "desc" ? 1 : 0;
  // list [run, run, run] -- run: { id, label, date }
  const listSortedDate = [...list].sort((a, b) =>
    a.date > b.date ? -1 * ordered : a.date < b.date ? 1 * ordered : 0
  );
  return listSortedDate;
}

function sortRunsByName(list, order = "asc") {
  const orderName = order === "asc" ? -1 : order === "desc" ? 1 : 0;
  // list [run, run, run] -- run: { id, label, date }
  const listSortedName = [...list].sort((a, b) =>
    a.label > b.label ? -1 * orderName : a.label < b.label ? 1 * orderName : 0
  );
  return listSortedName;
}

export default function App() {
  const [order, setOrder] = useState("asc");
  // set sort field
  const [sortBy, setSortBy] = useState("date");
  const [selectedRunId, setSelectedRunId] = useState();
  console.log("🚀 ~ file: App.js:17 ~ App ~ selectedRunId:", selectedRunId);

  const orderNew = order === "asc" ? "desc" : "asc";

  console.log("order is ", order, ", newOrder is ", orderNew);

  // trying to copy allRuns without mutating it
  const runsSorted = sortRunsByDate(allRuns, order, sortBy);
  const runsSortedName = sortRunsByName(allRuns, order);

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
      <HeaderComponent title="Will will run" />
      <div className="body-content">
        <div className="runs-block">
          <RunSelector title="Past Runs" />
          <div className="run-filters">
            <label htmlFor="sort-by-select">Sort By</label>
            <select
              id="sort-by-order"
              value={sortBy}
              className="sort-by-select"
              name="by"
              onChange={(e) => {
                console.log("Sort by:", e.target.value);
                setSortBy(e.target.value);
              }}
            >
              <option value="name">Name</option>
              <option value="date">Date</option>
              {/* <option value="distance">Distance</option> */}
            </select>
            <label htmlFor="sort-order-select">Sort Order </label>
            <select
              id="sort-order-select"
              value={order}
              className="sort-order-select"
              onChange={(e) => {
                console.log("Changing sort order!", e.target.value);
                setOrder(e.target.value);
              }}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
          <ol>
            {sortBy === "date"
              ? runsSorted.map((runsSorted) => (
                  <RunCard
                    title={runsSorted.label}
                    date={runsSorted.date}
                    key={runsSorted.id}
                  ></RunCard>
                ))
              : runsSortedName.map((runsSorted) => (
                  <RunCard
                    title={runsSorted.label}
                    date={runsSorted.date}
                    key={runsSorted.id}
                  ></RunCard>
                ))}
          </ol>
          {/* <h2>placeholder data</h2>
          <ol>
            <li>
              <RunCard title="Run Title" date="2023-1-2" distance={1} />
            </li>
            <li>
              <RunCard title="Run Title 2" date="2022-2-3" distance={10} />
            </li>
            <li>
              <RunCard title="Run Title 3" date="2021-1-2" distance={100} />
            </li>
          </ol> */}
        </div>
        <p className="map-block">Map will go here!</p>
      </div>
      <div>
        <p className="copyright">Some copyright 2023</p>
      </div>
      {/* comment out here */}
      {/* <div className="background-box">
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
      </div>{" "} */}
      {/* comment out here */}
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
      <nav>
        <ul className="navigation">
          <li>
            <a className="nav-item" href="#runs">
              Runs
            </a>
          </li>
          <li>
            <a className="nav-item" href="#about">
              About
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

function RunCard(props) {
  const distanceClass =
    props.distance < 10 ? "short" : props.distance <= 20 ? "medium" : "long";

  return (
    <a
      href="https://www.developmentseed.org"
      className="run-cards"
      onClick={(e) => {
        e.preventDefault();
        console.log(
          "clicked run – card title:",
          props.title,
          ", date:",
          props.date
        );
      }}
    >
      <img
        className="run-thumbnail"
        src="https://placehold.co/100x75"
        alt="Placeholder"
        width="100"
        height="75"
      ></img>
      <div className="run-attributes">
        <h3 className="run-name">{props.title}</h3>
        <time className="run-date">on {props.date}</time>
      </div>
      <div className={`run-distance ${distanceClass}`}>{props.distance}K</div>
    </a>
  );
}

function RunSelector(props) {
  return <h2 className="runs-block-title">{props.title}</h2>;
}
