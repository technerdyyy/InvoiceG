import React from "react";

const Skeleton = ({ className = "", count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className={`animate-pulse bg-gray-300 rounded-md ${className}`}
        ></div>
      ))}
    </>
  );
};

export default Skeleton;
