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
    // add the DEM source as a terrain layer with exaggerated height
    map.target.setTerrain({
      source: "mapbox-dem",
      exaggeration: 1,
    });
  }}
  onMove={(evt) => setViewport(evt.viewport)}
  // style={{ width: 600, height: 400 }}
  mapStyle="mapbox://styles/mapbox/outdoors-v11"
  setTerrain={{ source: "mapbox-dem", exaggeration: 1.5 }}
>
  {fetchedRun !== undefined ? (
    <Source id="my-data" type="geojson" data={fetchedRun.feature}>
      <Layer {...layerStyle} />
    </Source>
  ) : (
    ""
  )}
</Map>;

export default Mapbox;
