import React, { useEffect, useState } from "react";

const ProgressBar = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const duration = 20000;
    const increment = 100 / (duration / 100);

    const interval = setInterval(() => {
      setWidth((prevWidth) => {
        if (prevWidth >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prevWidth + increment;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-slate-800 h-2 mb-2 rounded">
      <div
        className="bg-main h-full rounded"
        style={{
          width: `${width}%`,
          transition: "width 0.1s linear",
        }}
      ></div>
    </div>
  );
};

export default ProgressBar;
