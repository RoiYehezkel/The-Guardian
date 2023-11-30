import React, { useEffect, useState } from "react";
import { CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./Labels.css";

function Labels({ labels }) {
  const count = labels.reduce((accumulator, label) => {
    return accumulator + label.labelCount;
  }, 0);

  return (
    <>
      <img
        src="/images/background-labels.png"
        alt="backgroung-category"
        className="backgroung-cat-image"
      />
      <h1 className="cat-header">Categories</h1>
      <div className="cat-container">
        <div className="cat-table">
          {labels.map((labelobj, index) => (
            <CircleProgress
              category={labelobj.str}
              labelCount={labelobj.labelCount}
              count={count}
              key={index}
            />
          ))}
        </div>
      </div>
    </>
  );
}

function CircleProgress({ category, labelCount, count }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const relativeSum = 100 / count;
      const percentage = labelCount * relativeSum;
      setVal(percentage.toFixed(2));
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [labelCount, count]);

  return (
    <div className="circle-container">
      <div className="circle-wrapper">
        <CircularProgressbar value={val} text={`${val}%`} />
      </div>
      <p className="circle-text">{category}</p>
    </div>
  );
}

export default Labels;
