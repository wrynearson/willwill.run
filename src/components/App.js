import React, { useEffect, useState } from "react";

import allRuns from "../data/activity_list.json";

import Map, {
  Source,
  Layer,
  NavigationControl,
  GeolocateControl,
} from "react-map-gl/maplibre";

import "maplibre-gl/dist/maplibre-gl.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import HeaderComponent from "./site/header";
import sortRunsByField from "./utils/sortRunsByField.js";
import RunSelector from "./site/runSorting";

import layerStyle from "./map/layerStyle";

import RunCard from "./gpx/runCard";
import Metadata from "./gpx/metadata";

import { Helmet } from "react-helmet";

import { format } from "date-fns";
import NotFound from "../pages/NotFound/NotFound";

import { useLocation, useParams, useSearchParams } from "react-router-dom";

const baseurl = process.env.PUBLIC_URL || "";

// convert seconds into H:MM:SS
function secondsToTime(e) {
  const h = Math.floor(e / 3600).toString();
  const m = Math.floor((e % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(e % 60)
    .toString()
    .padStart(2, "0");

  return h < 1 ? `${m}:${s}` : `${h}:${m}:${s}`;
}

export default function App() {
  const { runId } = useParams();
  const selectedRun = runId;
  const [searchParams, setSearchParams] = useSearchParams();

  const orderBy = searchParams.get("order") || "desc";
  const sortBy = searchParams.get("sort") || "date";

  const [fetchedRun, setFetchedRun] = useState();

  const location = useLocation();
  console.log("location", location, location.search);

  console.log("runId, selectedRun", runId, selectedRun);
  console.log("sort, order:", sortBy, orderBy);

  const [viewport, setViewport] = useState({
    longitude: 6.96,
    latitude: 47.02,
    zoom: 4,
  });

  useEffect(() => {
    if (!selectedRun) return;
    console.log("request run data for:", selectedRun);

    async function loader() {
      // toast is loading
      const toastRun = toast.loading(<div>Loading run: {selectedRun}</div>, {
        position: "bottom-right",
        autoClose: false,
      });
      try {
        const response = await fetch(
          `${baseurl}/data/activities/transformed/${selectedRun}.json`
        );

        if (response.status >= 400) {
          // wrong response. show error.

          toast.update(toastRun, {
            type: "error",
            render: (
              <>
                <div>{selectedRun} not loaded successfully.</div>
                <div>Error code: {`(${response.status})`}</div>
              </>
            ),
            delay: 750,
            autoClose: 3000,
            isLoading: false,
          });
        }

        const result = await response.json();

        toast.update(toastRun, {
          render: (
            <>
              <div>{selectedRun} loaded successfully.</div>
              <div>Success code: {`(${response.status})`}</div>
            </>
          ),
          type: "success",
          delay: 750,
          autoClose: 1000,
          isLoading: false,
        });

        const run = {
          name: result.features[0].properties.name,
          type: result.features[0].properties.activity_sport_type,
          moving_time: result.features[0].properties.moving_time,
          elapsed_time: result.features[0].properties.elapsed_time,
          distance: result.features[0].properties.distance,
          elevation: result.features[0].properties.total_elevation_gain,
          feature: result.features[0],
        };

        console.log(
          "run distance, elevation, time:",
          run.distance,
          run.elevation,
          run.elapsed_time
        );

        setFetchedRun(run);
        console.log("FETCHED RUN feature:", run.feature);
        setViewport({
          longitude: run.feature.geometry.coordinates[0][0],
          latitude: run.feature.geometry.coordinates[0][1],
          zoom: 13,
          pitch: 30,
          bearing: 0,
        });
      } catch (error) {
        // toast error try again
        console.log("caught error: ", error);
        toast.update(toastRun, {
          type: "error",
          render: (
            <div>{selectedRun} not loaded successfully. Please try again</div>
          ),
          delay: 750,
          autoClose: 3000,
          isLoading: false,
        });
      }
    }

    loader();
  }, [selectedRun]);

  const runsSorted = sortRunsByField(allRuns, sortBy, orderBy);

  // if run.id === runID is not NotFound, returns undefined. If it's undefined, execute if statement

  if (selectedRun && !runsSorted.find((run) => run.id.toString() === runId)) {
    // This is better in this use case because any /subdomain could match /:runId, so loading the NotFound component is more direct, and it keeps the incorrect URL visible so that users can flag an issue
    return <NotFound />;
    // return <Navigate to="/not-found" replace={true} />;
  }

  return (
    <>
      <Helmet>
        <title>Will will run</title>
        <meta name="theme-color" content="#05651b" />
      </Helmet>
      <HeaderComponent title="Will will run" />
      <div className="body-content">
        <div className="runs-block">
          <RunSelector title="Past Runs" />
          <div className="run-filters">
            <div className="run-filter">
              <label htmlFor="sort-by-select">Sort By</label>
              <select
                id="sort-by-order"
                value={sortBy}
                className="sort-by-select"
                name="by"
                onChange={(e) => {
                  console.log("Now sorting by:", e.target.value);
                  setSearchParams({ sort: e.target.value, order: orderBy });
                }}
              >
                <option value="name">Name</option>
                <option value="date">Date</option>
              </select>
            </div>
            <div className="run-filter">
              <label htmlFor="sort-order-select">Sort Order </label>
              <select
                id="sort-order-select"
                value={orderBy}
                className="sort-order-select"
                onChange={(e) => {
                  console.log("New sort order: ", e.target.value);
                  setSearchParams({ sort: sortBy, order: e.target.value });
                }}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          <div className="runCardContainer">
            <ol className="runCards">
              {runsSorted.map((run) => (
                <li key={run.id} className="runCardLI">
                  <RunCard
                    title={run.name}
                    date={format(run.date, "iii, d LLL yyy")}
                    id={run.id}
                    selectedRun={selectedRun}
                    sort={sortBy}
                    order={orderBy}
                    location={location}
                  />
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="map-block">
          <Map
            {...viewport}
            initialViewState={viewport}
            // uncomment and add terrain source below
            terrain={{
              source: "terrain-source",
              exaggeration: 0.04,
            }}
            onMove={(evt) => setViewport(evt.viewport)}
            mapStyle="https://tiles.openfreemap.org/styles/positron"
            maxPitch={75}
          >
            {/* Add source for global terrain tiles in URL below*/}
            <Source
              id="terrain-source"
              type="raster-dem"
              tiles={[
                "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
              ]}
            />

            <Layer
              id="hills"
              type="hillshade"
              source="terrain-source"
              paint={{
                "hillshade-shadow-color": "#a6a6a6",
                "hillshade-exaggeration": 0.05,
              }}
              layout={{ visibility: "visible" }}
              minzoom={10}
            />

            <NavigationControl />

            {fetchedRun !== undefined ? (
              <Source id="my-data" type="geojson" data={fetchedRun.feature}>
                <Layer {...layerStyle} />
              </Source>
            ) : (
              ""
            )}
          </Map>
          {fetchedRun !== undefined ? (
            <Metadata
              name={fetchedRun !== undefined ? fetchedRun.name : "Name"}
              time={
                fetchedRun !== undefined
                  ? secondsToTime(fetchedRun.elapsed_time)
                  : "Time"
              }
              distance={
                fetchedRun !== undefined
                  ? parseFloat((fetchedRun.distance / 1000).toFixed(2))
                  : "Distance"
              }
              elevationGain={
                fetchedRun !== undefined
                  ? parseFloat(Math.round(fetchedRun.elevation)) + "m"
                  : "Elevation Gain"
              }
              pace={
                fetchedRun !== undefined
                  ? secondsToTime(
                      fetchedRun.elapsed_time / (fetchedRun.distance / 1000)
                    ) + "/km"
                  : "Pace"
              }
              type={
                fetchedRun !== undefined
                  ? fetchedRun.type === "TrailRun"
                    ? "🏔️"
                    : "👟"
                  : "Type"
              }
            />
          ) : null}
        </div>
      </div>
      <footer className="footer">
        <p className="copyright">Some copyright 2024</p>
      </footer>
      <div>
        <ToastContainer />
      </div>
    </>
  );
}
