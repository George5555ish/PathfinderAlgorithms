import React from "react";
import "./modal.css";

export default function Modal(props) {
  if (!props.show) {
    return null;
  }

  return (
    <div id="myModal" className="modal">
      <div className="modal-content">
        <div className="modal-header">
          <span className="close" id="onClose">
            &times;
          </span>
          <div className="pathfinder-image"></div>
        </div>

        <div className="modal-body">
          <div className="grid-box">
            <h1 className="steps">
              Step 1<p>Select your StartNode and FinishNode</p>
              <div className="modal-gif"></div>
            </h1>
          </div>

          <div className="grid-box">
            <h1 className="steps">
              Step 2<p>Click and Drag to set Walls</p>
              <div className="modal-gif2"></div>
            </h1>
          </div>

          <div className="grid-box">
            <h1 className="steps">
              Step 3
              <p>
                Select Your Algorithm for<br></br> Shortest path
              </p>
              <div className="modal-gif3"></div>
            </h1>
          </div>
        </div>
        <div className="modal-footer">
          <button className="learn-more" id="learnMore">
            {" "}
            Let's Go!
          </button>
        </div>
      </div>
    </div>
  );
}
