function MusicFormatter({ musicData }) {
  const renderMusic = () => {
    const notes = musicData.music.chords.reduce((array, current) => {
      if (current.name) {
        array.push(current.name);
      }
      return array;
    }, []);

    const lines = musicData.music.music.split("\n");

    return lines.map((line, index) => {
      const parts = line.split(notes).filter(Boolean);
      return (
        <div key={index}>
          {parts.map((part, i) =>
            notes.indexOf(part) === -1 ? (
              <div
                key={i}
                className="chord-hover"
                style={{ display: "inline" }}
              >
                {part}
              </div>
            ) : (
              <span key={i}>{part}</span>
            )
          )}
        </div>
      );
    });
  };

  return <div>{renderMusic()}</div>;
}

export default MusicFormatter;
