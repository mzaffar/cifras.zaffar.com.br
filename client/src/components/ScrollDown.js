import { mdiArrowDownCircle } from "@mdi/js";
import IconButton from "./IconButton";

function ScrollDown() {
  const scrollDown = () => {
    const duration = 2000;
    const startTime = performance.now();

    const halfWindowHeight = window.innerHeight / 2;
    const startScrollY = window.scrollY;
    const animateScroll = (currentTime) => {
      const elapsedTime = currentTime - startTime;
      const progress = elapsedTime / duration;

      if (progress < 1) {
        const easeProgress = easeOutQuart(progress);
        const scrollY = startScrollY + easeProgress * halfWindowHeight;
        window.scrollTo(0, scrollY);
        requestAnimationFrame(animateScroll);
      } else {
        window.scrollTo(0, startScrollY + halfWindowHeight);
      }
    };

    const easeOutQuart = (t) => 1 - --t * t * t * t;

    requestAnimationFrame(animateScroll);
  };

  return (
    <div className="fixed bottom-0 right-0">
      <div className="p-3">
        <IconButton
          onClick={() => scrollDown()}
          path={mdiArrowDownCircle}
          size={"2rem"}
          color="none"
        />
      </div>
    </div>
  );
}

export default ScrollDown;
