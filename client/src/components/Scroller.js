import { mdiMinusThick, mdiPlusThick, mdiStop } from "@mdi/js";
import { useEffect, useState } from "react";
import IconButton from "./IconButton";
import SimpleButton from "./SimpleButton";

function Scroller() {
  const [intervalScroll, setIntervalScroll] = useState(0);
  const [showControllees, setShowControllees] = useState(false);
  const [scrollIntervalId, setScrollIntervalId] = useState(null);

  const speeds = [0, 200, 100, 60, 40, 20, 10];

  const decrementInterval = () => {
    if (intervalScroll === 0) return;
    setIntervalScroll(intervalScroll - 1);
  };

  const incrementInterval = () => {
    if (intervalScroll === speeds.length - 1) return;
    setIntervalScroll(intervalScroll + 1);
  };

  useEffect(() => {
    if (scrollIntervalId) {
      clearInterval(scrollIntervalId);
    }

    if (intervalScroll > 0) {
      const id = setInterval(() => {
        window.scrollBy({ top: 1, behavior: "smooth" });
      }, speeds[intervalScroll]);

      setScrollIntervalId(id);
    }

    return () => {
      if (scrollIntervalId) {
        clearInterval(scrollIntervalId);
      }
    };
  }, [intervalScroll]);

  return (
    <>
      {showControllees && (
        <div className="fixed top-2 right-2 bg-yellow-500 text-white text-center p-2 rounded z-10">
          <div className="flex">
            <div className="mr-2">
              <IconButton
                className={"rounded"}
                path={mdiStop}
                size={"1rem"}
                color="bg-yellow-800"
                onClick={() => setIntervalScroll(0)}
              />
            </div>

            <div className="flex">
              <IconButton
                className={"rounded-l rounded-r-none"}
                path={mdiMinusThick}
                size={"1rem"}
                color="bg-yellow-800"
                onClick={() => decrementInterval()}
              />
              <div className="bg-yellow-800 px-2">{intervalScroll}</div>
              <IconButton
                className={"rounded-r rounded-l-none"}
                path={mdiPlusThick}
                size={"1rem"}
                color="bg-yellow-800"
                onClick={() => incrementInterval()}
              />
            </div>
          </div>
        </div>
      )}
      <div className="flex">
        <SimpleButton
          color="bg-slate-800"
          label="Rolagem automatica"
          onClick={() => setShowControllees(!showControllees)}
        />
      </div>
    </>
  );
}

export default Scroller;
