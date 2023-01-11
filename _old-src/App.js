/* global gpxParser */

// 6.9 
  // save elevation into a separate (or same) list, add as circle markers (uniform)
  // add elevation information into a leaflet tooltip
    // start with one of 1700 points, then do all (might need map function)

import { useEffect, useState } from 'react';
import { MapContainer, Polyline, TileLayer, Marker, Popup } from 'react-leaflet';
import logo from './logo.svg';
import './App.css';
import { myRun } from './myRun';
import XMLData from './morningRun.gpx';
import axios from "axios";

function App() {
  const name = 'will'
  // this function sets the state of the positions constant as an empty array, then setPositions(tempPositions) takes the positions, and indicates a change of state
  const [positions, setPositions] = useState([]);
  // making a get request from REST api, but getting xml data from the disk
  useEffect (() => {
    axios.get(XMLData, {
    "Content-Type": "application/xml; charset=utf-8"
      })
    // Always asyncronous ("promise" -> can make many calls without stalling and waits for resplonse, unlike Python)
    .then((response) => {
    //  console.log('Your xml file as string', response.data);

    var gpx = new gpxParser();
    gpx.parse(response.data)
    console.log(gpx)
    // 31.08 (1) rewrite line below (15) into a for loop to extract positions (about 3 lines), (2) read Morning_Run.gpx directly, instead of myRun.js
    // const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon])
    const tempPositions = []
    for (let i = 0; i < gpx.tracks[0].points.length; i++) {
      // every function has .push, to append to an array
      tempPositions.push([gpx.tracks[0].points[i].lat, gpx.tracks[0].points[i].lon])
    }
    setPositions(tempPositions)
      });
  }, [])
  
  return (
    <div className="App">
      <MapContainer center={[46.2044, 6.1432]} zoom={12} scrollWheelZoom={true}>
      <TileLayer
    url="https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg"
    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <Polyline
        pathOptions={{ fillColor: 'red', color: 'blue' }}
        positions={positions}
      />
      {/* <Marker
        position={[
          gpx.tracks[0].points[0].lat, gpx.tracks[0].points[0].lon
        ]}
      /> */}
    </MapContainer>
    </div>
  );
}

export default App;
