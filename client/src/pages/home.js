import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import MainContainer from "../components/MainContainer";
import Modal from "../components/Modal";
import SimpleButton from "../components/SimpleButton";
import Title from "../components/Title";
import { slugToCamelCase } from "../utils";

function Home() {
  const navigate = useNavigate();
  const [folderData, setFolderData] = useState({ name: "" });
  const [folders, setFolders] = useState([]);
  const [showCreateFolder, setShowCreateFolder] = useState(false);
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFolders();
  }, []);

  useEffect(() => {
    if (showCreateFolder && inputRef.current) inputRef.current.focus();
  }, [showCreateFolder]);

  const getFolders = () => {
    setLoading(true);
    fetch("https://cifras.zaffar.com.br:9001/folder/list")
      .then((res) => res.json())
      .then((res) => {
        setFolders(res);
        setLoading(false);
      });
  };

  const createFolderHandler = () => {
    if (folderData.name === "") return;
    setLoading(true);

    fetch("https://cifras.zaffar.com.br:9001/folder/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(folderData),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        navigate(`/${folderData.name}`);
      });
  };

  const FoldersList = () => {
    if (!folders) return null;

    return folders.map((folder, i) => (
      <div
        key={i}
        className="border-b border-slate-700 hover:bg-slate-700 transition-colors duration-200"
      >
        <a href={`/${folder}`}>
          <div className="py-2 container mx-auto text-slate-400 text-md px-2 md:px-0">
            {slugToCamelCase(folder)}
          </div>
        </a>
      </div>
    ));
  };

  return (
    <MainContainer>
      <Header>
        <SimpleButton
          label={"Criar pasta"}
          color="bg-blue-800"
          onClick={() => setShowCreateFolder(true)}
          loading={loading}
        />
      </Header>
      <Title title="Pastas" />

      {showCreateFolder && (
        <Modal title="Criar Pasta">
          <div className="p-2">
            <input
              ref={inputRef}
              type="text"
              className="bg-slate-800 text-slate-100 rounded py-2 px-3 w-full mb-2"
              placeholder="Nome da pasta"
              value={folderData.name}
              onChange={(e) => {
                setFolderData({ name: e.target.value });
              }}
            />
            <div className="flex space-x-2">
              <SimpleButton
                label={"Criar"}
                loading={loading}
                onClick={() => createFolderHandler()}
              />

              <SimpleButton
                color="bg-slate-700"
                label={"Cancelar"}
                loading={loading}
                onClick={() => {
                  setShowCreateFolder(false);
                  setFolderData({ name: "" });
                }}
              />
            </div>
          </div>
        </Modal>
      )}

      <FoldersList />
    </MainContainer>
  );
}

export default Home;
