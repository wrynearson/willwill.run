function Metadata(props) {
  const distanceClassM =
    props.distance < 10 ? "short" : props.distance <= 20 ? "medium" : "long";
  return (
    <ol className="metadata-box">
      <li>
        <h2 className="metadata-field-title">Name:</h2>
        <h3 className="metadata-field">{props.name}</h3>
      </li>
      <li>
        <h2 className="metadata-field-title">Time:</h2>
        <h3 className="metadata-field">{props.time}</h3>
      </li>
      <li>
        <h2 className="metadata-field-title">Distance:</h2>
        <h3 className={`metadata-field ${distanceClassM}`}>
          {props.distance}km
        </h3>
      </li>
      <li>
        <h2 className="metadata-field-title">Pace:</h2>
        <h3 className="metadata-field">{props.pace}</h3>
      </li>
      <li>
        <h2 className="metadata-field-title">Elevation gain:</h2>
        <h3 className="metadata-field">{props.elevationGain}</h3>
      </li>
    </ol>
  );
}

export default Metadata;
