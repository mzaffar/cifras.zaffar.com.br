import Chord from "./Chord";

function ShowChord({ musicData, chord_name, showChordPosition }) {
  const getChordByName = (chord_name) => {
    const chord = musicData.music.chords.find(
      (chord) => chord.name === chord_name
    );
    return chord;
  };

  console.log("showChordPosition", showChordPosition);

  return (
    <div
      className="absolute"
      style={{ top: showChordPosition.y, left: showChordPosition.x }}
    >
      {<Chord chord={getChordByName(chord_name)} />}
    </div>
  );
}

export default ShowChord;
