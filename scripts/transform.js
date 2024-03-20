function transformActivity(activityMeta, activityDetails) {
  const latlng = activityDetails.find((obj) => {
    return obj.type === "latlng" ? true : false;
  });

  const transformedActivity = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          id: activityMeta.id,
          name: activityMeta.name,

          // run could be a street run or trail run. Could be useful to group all runs (street and trail together)
          activity_type: activityMeta.type,

          // trail run is specified
          activity_sport_type: activityMeta.sport_type,

          start_time: activityMeta.start_date_local,
          timezone: activityMeta.timezone,
          utc_offset: activityMeta.utc_offset,
          country: activityMeta.location_country,

          // "only me" = private, "followers_only" means semi-private, "everyone" = public
          visibility: activityMeta.visibility,

          distance: activityMeta.distance,
          moving_time: activityMeta.moving_time,
          elapsed_time: activityMeta.elapsed_time,
          total_elevation_gain: activityMeta.total_elevation_gain,

          polyline: activityMeta.map.summary_polyline,
        },
        geometry: {
          type: "LineString",
          coordinates: latlng.data.map((coor) => {
            return [coor[1], coor[0]];
          }),
        },
      },
    ],
  };

  return transformedActivity;
}

module.exports = transformActivity;
