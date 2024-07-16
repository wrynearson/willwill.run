import { Link } from "react-router-dom";
import orderBy from "../App";
import sortBy from "../App";
import location from "../App";

function RunCard(props) {
  const selectedRunClass =
    props.selectedRun === props.id.toString() ? "selected" : "";

  return (
    <Link
      to={`/${props.id}${props.location.search}`}
      className={`run-card ${selectedRunClass}`}
    >
      <div className="run-attributes truncate">
        <h3 className="run-name truncate">{props.title}</h3>
        <time className="run-date">on {props.date}</time>
      </div>
    </Link>
  );
}

export default RunCard;
