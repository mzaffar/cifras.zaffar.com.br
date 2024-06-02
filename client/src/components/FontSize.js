import { mdiFormatSize, mdiMinusThick, mdiPlusThick } from "@mdi/js";
import Icon from "@mdi/react";
import { fontSizes } from "../utils";
import IconButton from "./IconButton";

function FontSize({ fontSize, setFontSize }) {
  const increaseSize = () => {
    if (fontSize < fontSizes.length - 1) setFontSize(fontSize + 1);
  };

  const decreaseSize = () => {
    if (fontSize > 0) setFontSize(fontSize - 1);
  };
  return (
    <div className="flex">
      <IconButton
        className={"rounded-l rounded-r-none"}
        path={mdiMinusThick}
        size={"1rem"}
        color="bg-slate-800"
        onClick={() => decreaseSize()}
      />
      <div className="bg-slate-800 px-2">
        <Icon path={mdiFormatSize} size={1} />
      </div>
      <IconButton
        className={"rounded-r rounded-l-none"}
        path={mdiPlusThick}
        size={"1rem"}
        color="bg-slate-800"
        onClick={() => increaseSize()}
      />
    </div>
  );
}

export default FontSize;
