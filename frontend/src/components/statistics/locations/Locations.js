import React from "react";
import "./Locations.css";

function Locations(props) {
  const locations = props.locations;
  return (
    <>
      <img
        src="/images/locations-background.jpg"
        alt="backgroung-locations"
        className="backgroung-locations-image"
      />
      <h1 className="location-header">Locations</h1>
      <div className="location-cards">
        <div className="location-container">
          <div className="location-wrapper">
            <ul className="location-table">
              {locations.map((location) => {
                return (
                  <SingleLocation
                    key={location.id}
                    location={location.location}
                    date={location.date}
                  />
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function SingleLocation(props) {
  return (
    <div className="single-location">
      <p className="text-location">
        You visit in "{props.location}" in the {props.date}
      </p>
    </div>
  );
}

export default Locations;
