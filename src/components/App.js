import React, { useState } from "react";
import { allRuns } from "../data";

function sortRunsByDate(list, order = "asc") {
  const ordered = order === "asc" ? -1 : order === "desc" ? 1 : 0;
  // list [run, run, run] -- run: { id, label, date }
  const listSortedDate = [...list].sort((a, b) =>
    a.date > b.date ? -1 * ordered : a.date < b.date ? 1 * ordered : 0
  );
  return listSortedDate;
}

function sortRunsByName(list, order = "asc") {
  const ordered = order === "asc" ? -1 : order === "desc" ? 1 : 0;
  const listSortedName = [...list].sort((a, b) =>
    a.label > b.label ? -1 * ordered : a.label < b.label ? 1 * ordered : 0
  );
  return listSortedName;
}

export default function App() {
  const [order, setOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("date");

  const runsSorted = sortRunsByDate(allRuns, order);
  const runsSortedName = sortRunsByName(allRuns, order);

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
                console.log("Now sorting by:", e.target.value);
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
                console.log("New sort order: ", e.target.value);
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
    </>
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
