async function loader() {
  // toast is loading
  const toastRun = toast.loading(<div>Loading run: {selectedRun}</div>, {
    position: "bottom-right",
    autoClose: false,
  });
  setLoadRunStatus("loading");
  try {
    const response = await fetch(`/data/${selectedRun}.gpx`);

    if (response.status >= 400) {
      // wrong response. show error.

      setLoadRunStatus(response.status);

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

    const result = await response.text();

    // toast success

    setLoadRunStatus(response.status);

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

    const gpx = new gpxParser();
    gpx.parse(result);
    console.log(gpx);

    const run = {
      distance: gpx.tracks[0].distance.total,
      elevation: gpx.tracks[0].elevation,
      feature: gpx.toGeoJSON().features[0],
    };

    setFetchedRun(run);
    setViewport({
      longitude: run.feature.geometry.coordinates[0][0],
      latitude: run.feature.geometry.coordinates[0][1],
      zoom: 12,
      pitch: 30,
    });
  } catch (error) {
    // toast error try again
    setLoadRunStatus(error);
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

export default loader;
