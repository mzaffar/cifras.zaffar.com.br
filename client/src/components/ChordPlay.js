import { useState } from "react";

function ChordPlay({ children, chord }) {
  const [delay, setDelay] = useState(50);
  const play = () => {
    let notes = chord.notes.map((note) => note.note_play);

    notes = notes.reverse();

    for (let i = 1; i <= notes.length; i++) {
      const string = i;

      (function (string) {
        setTimeout(async () => {
          const note = notes[string - 1];

          if (!note) return;
          if (note === "X") return;

          try {
            const response = await fetch(
              `/assets/sounds/${string}_${note}.txt`
            );
            const base64 = await response.text();
            const audio = new Audio(`data:audio/mpeg;base64,${base64}`);
            audio.play();
          } catch (error) {
            console.error("Error fetching or playing audio:", error);
          }
        }, (notes.length - i) * delay);
      })(string);
    }
  };

  return (
    <div className="cursor-pointer" onClick={() => play()}>
      {children}
    </div>
  );
}

export default ChordPlay;
