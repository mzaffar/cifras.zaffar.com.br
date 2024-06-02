import { useState } from "react";

function App() {
  const [folderData, setFolderData] = useState({ name: "" });

  // useEffect(() => {
  //   fetch("http://localhost:9001/testAPI")
  //     .then((res) => res.text())
  //     .then((res) => console.log("res"));
  // }, []);

  const createFolderHandler = () => {
    if (folderData.name === "") return;

    fetch("http://localhost:9001/folder/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(folderData),
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  };

  return (
    <div className="bg-slate-900 w-full h-screen">
      <div>
        <input
          type="text"
          className="bg-slate-800 text-white"
          onChange={(e) => {
            setFolderData({ name: e.target.value });
          }}
        />
        <button onClick={() => createFolderHandler()}>Enviar</button>
      </div>
    </div>
  );
}

export default App;
