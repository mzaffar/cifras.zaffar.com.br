import { useState } from "react";

function ChordPlay({ children, chord }) {
  const [delay, setDelay] = useState(50);

  const loadFiles = async () => {
    console.log("Loading files...");
    const notes = chord.notes.map((note) => note.note_play);
    const notesPlayed = chord.notes
      .map((note) => note.note_play)
      .filter((note) => note !== "X");

    let loaded = 0;
    for (let i = 1; i <= notes.length; i++) {
      const note = notes[i - 1];

      if (!note) continue;
      if (note === "X") continue;

      try {
        await fetch(`/assets/sounds/${i}_${note}.txt`);
        loaded += 1;

        if (loaded === notesPlayed.length) play();
      } catch (error) {
        console.error("Error fetching or playing audio:", error);
      }
    }
  };

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
    <div className="cursor-pointer" onClick={() => loadFiles()}>
      {children}
    </div>
  );
}

export default ChordPlay;
