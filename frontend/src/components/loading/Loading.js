import React from "react";
import "./Loading.css";

function Loading() {
  return (
    <div className="loader-container">
      <div id="circle">
        <div className="loader">
          <div className="loader">
            <div className="loader">
              <div className="loader"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
