import { useEffect, useState } from "react";
import ChordPlay from "./ChordPlay";

function Chord({ chord, key }) {
  const [fretMinMax, setFretMinMax] = useState({
    max: -Infinity,
    min: Infinity,
  });

  useEffect(() => {
    const fret_min_max = chord.notes.reduce(
      (acc, obj) => {
        if (obj.note_play > acc.max && obj.note_play !== "X")
          acc.max = obj.note_play;
        if (obj.note_play < acc.min && obj.note_play !== "X")
          acc.min = obj.note_play;
        return acc;
      },
      { max: -Infinity, min: Infinity }
    );
    setFretMinMax(fret_min_max);
  }, [chord]);

  const transformValue = (value) => {
    if (fretMinMax.max <= 5) return value;

    const newMax = 2 + (fretMinMax.max - fretMinMax.min);

    return (
      2 +
      ((newMax - 2) * (value - fretMinMax.min)) /
        (fretMinMax.max - fretMinMax.min)
    );
  };

  const FretIndicator = ({ notes }) => {
    if (fretMinMax.max <= 5) return <></>;

    return <div className="fret-indicator">{fretMinMax.min}ª</div>;
  };

  const Notes = () => {
    return chord.notes.map((note, index) => {
      const note_play = note.note_play;
      if (note_play === "X" || note_play === "0")
        return <div key={index}></div>;
      return (
        <div
          key={index}
          className={`absolute note string-${index} fret-${transformValue(
            note_play
          )}`}
        ></div>
      );
    });
  };

  if (fretMinMax.max === -Infinity || fretMinMax.min === Infinity) return <></>;

  return (
    <div className="p-2">
      <ChordPlay chord={chord}>
        <div className="bg-slate-200 px-4 pb-2 rounded">
          <div className="text-center text-sm text-slate-800">{chord.name}</div>
          <div className="relative">
            <div className="chord">
              <FretIndicator notes={chord.notes} />
              <Notes />
            </div>
          </div>
        </div>
      </ChordPlay>
    </div>
  );
}

export default Chord;
