function RunCard(props) {
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
      {/* remove images for now */
      /* <img
        className="run-thumbnail"
        src="https://placehold.co/100x75"
        alt="Placeholder"
        width="100"
        height="75"
      /> */}
      <div className="run-attributes truncate">
        <h3 className="run-name truncate">{props.title}</h3>
        <time className="run-date">on {props.date}</time>
      </div>
    </a>
  );
}

export default RunCard;
