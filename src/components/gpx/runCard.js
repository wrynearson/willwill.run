import { Link, useParams } from "react-router-dom";
import selectedRun from "../App";

function RunCard(props) {
  const selectedRunClass = props.selectedRun === props.id ? "selected" : "";
  return (
    <Link
      to={selectedRun}
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
      <div className="run-attributes truncate">
        <h3 className="run-name truncate">{props.title}</h3>
        <time className="run-date">on {props.date}</time>
      </div>
    </Link>
  );
}

export default RunCard;
