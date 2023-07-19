import React, { useEffect, useState } from "react";
import { allRuns } from "../data";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function sortRunsByField(list, sortBy, order = "asc") {
  const ordered = order === "asc" ? -1 : order === "desc" ? 1 : 0;
  const listSorted = [...list].sort((a, b) =>
    sortBy === "name"
      ? a.label > b.label
        ? -1 * ordered
        : a.label < b.label
        ? 1 * ordered
        : 0
      : a.date > b.date
      ? -1 * ordered
      : a.date < b.date
      ? 1 * ordered
      : 0
  );
  return listSorted;
}

export default function App() {
  const [order, setOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("date");
  const [selectedRun, setSelectedRun] = useState();
  const [fetchedRun, setFetchedRun] = useState();

  const notify = () => toast("Wow so easy!");

  console.log("selectedRun:", selectedRun);
  console.log("current fetched run:", fetchedRun);

  // {
  //   status: 'idle' | 'loading' | 'succeeded' | 'failed'
  // }

  useEffect(() => {
    if (!selectedRun) return;
    console.log("request run data for:", selectedRun);

    async function loader() {
      try {
        // toast is loading
        toast.info("Loading selected run", {
          position: "bottom-right",
          closeButton: false,
          autoClose: false,
          closeOnClick: false,
          pauseOnHover: false,
          draggable: false,
          theme: "light",
        });

        const response = await fetch(`/data/${selectedRun}.gpx`);

        if (response.status >= 400) {
          // wrong response. show error.
        }

        const result = await response.text();

        // toast success
        toast.success("Selected run loaded", {
          delay: 500,
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });

        console.log("result", result);
        setFetchedRun(result);
      } catch (error) {
        // toast error try again
        toast.error("Please try again", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: false,
          progress: undefined,
          theme: "light",
        });
        console.log("request errored", error);
      }
    }

    loader();
  }, [selectedRun]);

  const runsSorted = sortRunsByField(allRuns, sortBy, order);

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
            {runsSorted.map((runsSorted) => (
              <li key={runsSorted.id}>
                <RunCard
                  title={runsSorted.label}
                  date={runsSorted.date}
                  id={runsSorted.id}
                  setSelectedRun={setSelectedRun}
                  selectedRun={selectedRun}
                />
              </li>
            ))}
          </ol>
        </div>
        <p className="map-block">Map will go here!</p>
      </div>
      <div>
        <p className="copyright">Some copyright 2023</p>
      </div>
      <div>
        <button onClick={notify}>Notify!</button>
        <ToastContainer />
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
  const selectedRunClass = props.selectedRun === props.id ? "selected" : "";

  return (
    <a
      href="https://www.developmentseed.org"
      className={`run-card ${selectedRunClass}`}
      onClick={(e) => {
        e.preventDefault();
        console.log(
          "clicked run – card title:",
          props.title,
          ", date:",
          props.date
        );
        props.setSelectedRun(props.id);
      }}
    >
      <img
        className="run-thumbnail"
        src="https://placehold.co/100x75"
        alt="Placeholder"
        width="100"
        height="75"
      />
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
