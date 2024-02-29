function transformActivity(activityMeta, activityDetails) {
  const transformedActivity = {
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

    polyline: activityMeta.map.summary_polyline,

    point_data: activityDetails
      .filter((obj) => {
        return obj.type === "latlng" ? false : true;
      })
      .map((obj) => {
        return { type: obj.type, data: obj.data };
      }),
  };

  return transformedActivity;
}

module.exports = transformActivity;
