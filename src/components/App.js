import React, { useEffect, useState } from "react";

import allRuns from "../data/activity_list.json";
import Map, { Source, Layer } from "react-map-gl";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "mapbox-gl/dist/mapbox-gl.css";

import HeaderComponent from "./site/header";
import sortRunsByField from "./utils/sortRunsByField.js";
import RunSelector from "./site/runSorting";

import layerStyle from "./map/layerStyle";

import RunCard from "./gpx/runCard";
import Metadata from "./gpx/metadata";

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
  //return `${h}:${m}:${s}`;
}

export default function App() {
  const [order, setOrder] = useState("desc");
  const [sortBy, setSortBy] = useState("date");
  const [selectedRun, setSelectedRun] = useState();
  const [fetchedRun, setFetchedRun] = useState();

  const [viewport, setViewport] = useState({
    longitude: 6.96,
    latitude: 47.02,
    zoom: 4,
  });

  // console.log("selectedRun:", selectedRun);
  // console.log("current fetched run:", fetchedRun);

  // console.log("current run promise status: ", loadRunStatus);

  // {
  //   status: 'idle' | 'loading' | 'succeeded' | 'failed'
  // }

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
        console.log("result", result);
        // toast success

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

        console.log(
          "THIS IS THE RESULT distance",
          result.features[0].properties.distance
        );

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
          <div className="runCardContainer">
            <ol>
              {runsSorted.map((runsSorted) => (
                <li key={runsSorted.id}>
                  <RunCard
                    title={runsSorted.name}
                    date={runsSorted.date}
                    id={runsSorted.id}
                    setSelectedRun={setSelectedRun}
                    selectedRun={selectedRun}
                    fetchedRun={fetchedRun}
                  />
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="map-block">
          <Map
            mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
            {...viewport}
            initialViewState={viewport}
            onLoad={(map) => {
              map.target.addSource("mapbox-dem", {
                type: "raster-dem",
                url: "mapbox://mapbox.mapbox-terrain-dem-v1",
                maxzoom: 14,
              });
              map.target.setTerrain({
                source: "mapbox-dem",
                exaggeration: 1,
              });
            }}
            onMove={(evt) => setViewport(evt.viewport)}
            mapStyle="mapbox://styles/mapbox/outdoors-v11"
          >
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
