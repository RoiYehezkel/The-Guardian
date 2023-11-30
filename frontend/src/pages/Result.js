import React from "react";
import Statistics from "../components/statistics/Statistics";

function Result(props) {
  return (
    <>
      <Statistics data={props.data} />
    </>
  );
}

export default Result;
