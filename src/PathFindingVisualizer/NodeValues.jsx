import React from "react";
import "./NodeValues.css";

export default function NodeValues(props) {
  const {
    startNodeRow,
    startNodeCol,
    finishNodeRow,
    finishNodeCol,
  } = props.nodeValues;

  return (
    <div className="overall-grid">
      {/* <p> </p>
      <p> </p>
      <p></p>
      <p></p> */}

      <div className="pathfinder-img"></div>

      <div className="overview-grid legend">
        <div className="overview-title" id="overview-title">
          {" "}
          Legend
        </div>

        <div className="overview-grid-box legend-grid">
          <div className="pages-view second-grid tabs legendary-grid">
            <div className="pages-view-text-fb card-views tabs handle legend-left">
              StartNode <div className="triangle-right"></div>
            </div>
            <div className="pages-view-text-fb card-views tabs handle legend-left">
              Wall <div className="triangle-right legend-wall"></div>
            </div>
            <div className="pages-view-text-fb card-views tabs handle legend-left">
              FinishNode <div className="triangle-right legend-circle"></div>
            </div>

            <div className="pages-view-text-fb card-views tabs handle legend-left">
              Visited Node <div className="triangle-right legend-visited"></div>
            </div>
          </div>

          <div></div>
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-title" id="overview-title">
          {" "}
          Node Values
        </div>

        <div className="overview-grid-box">
          <div className="pages-view second-grid tabs">
            <div className="pages-view-text-fb card-views tabs handle">
              StartNode Row:Col
            </div>
            <div className="page-views-amount amt-div tabs">
              {startNodeRow} / {startNodeCol}
            </div>
            <div className="pages-view-text-fb card-views tabs handle small">
              FinishNode Row:Col
            </div>

            <div className="page-views-amount amt-div tabs">
              {finishNodeRow} / {finishNodeCol}
            </div>
          </div>

          <div></div>
        </div>
      </div>
    </div>
  );
}
