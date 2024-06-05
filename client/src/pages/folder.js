import { mdiDotsVertical } from "@mdi/js";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import MainContainer from "../components/MainContainer";
import Modal from "../components/Modal";
import ProgressBar from "../components/ProgressBar";
import SimpleButton from "../components/SimpleButton";
import Title from "../components/Title";
import { config } from "../config";
import { filePathToMusicName, filePathToUrl, slugToCamelCase } from "../utils";

function Folder() {
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { folder } = useParams();

  const [showImportMusic, setShowImportMusic] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [musicLink, setMusicLink] = useState("");
  const [musics, setMusics] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getFiles();
  }, []);

  useEffect(() => {
    if (showImportMusic && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showImportMusic]);

  const getFiles = () => {
    fetch(
      `${config.api_url}/folder/artists?folder=${encodeURIComponent(folder)}`
    )
      .then((res) => res.json())
      .then((res) => setMusics(res));
  };

  const importMusicHandler = () => {
    setLoading(true);
    fetch(`${config.api_url}/music/import?folder=${folder}&url=${musicLink}`)
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        navigate(`/${folder}/${res.artist.slug}/${res.music.slug}`);
      })
      .catch((err) => {
        toast("Erro ao importar música. Tente novamente.", {
          type: "error",
        });
        setLoading(false);
      });
  };

  const deleteFolderHandler = () => {
    setLoading(true);
    fetch(`${config.api_url}/folder/delete?folder=${folder}`)
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        navigate(`/`);
      });
  };

  return (
    <MainContainer>
      <Header>
        <SimpleButton
          label={"Importar música"}
          color="bg-blue-800"
          onClick={() => setShowImportMusic(true)}
          loading={loading}
        />
        <IconButton
          path={mdiDotsVertical}
          size={"1rem"}
          color="bg-blue-800"
          onClick={() => setShowOptions(true)}
        />
      </Header>
      <Title title={slugToCamelCase(folder)} />

      {showImportMusic && (
        <Modal title="Importar música">
          <div className="p-2">
            {loading && <ProgressBar />}
            <input
              ref={inputRef}
              type="text"
              className="bg-slate-800 text-slate-100 rounded py-2 px-3 w-full mb-2"
              placeholder="Link da música no Cifra Club"
              value={musicLink}
              onChange={(e) => {
                setMusicLink(e.target.value);
              }}
            />
            <div className="flex space-x-2">
              <SimpleButton
                label={"Importar"}
                loading={loading}
                onClick={() => importMusicHandler()}
              />

              <SimpleButton
                label={"Cancelar"}
                onClick={() => setShowImportMusic(false)}
                color="bg-slate-700"
              />
            </div>
          </div>
        </Modal>
      )}

      {showOptions && (
        <Modal title="Opções">
          <div className="p-2 space-y-2">
            <SimpleButton
              label="Excluir pasta"
              className="text-center"
              color="bg-red-800"
              onClick={() => deleteFolderHandler()}
            />

            <SimpleButton
              label="Fechar"
              className="text-center"
              color="bg-slate-500"
              onClick={() => setShowOptions(false)}
            />
          </div>
        </Modal>
      )}

      {musics &&
        musics.map((artist) => {
          return (
            <div key={artist.name}>
              <h2 className="bg-slate-600 text-slate-900 py-1 px-2">
                <div className="container mx-auto font-bold">
                  {slugToCamelCase(artist.name)}
                </div>
              </h2>

              <ul>
                {artist.files.map((file) => {
                  return (
                    <li
                      key={file}
                      className=" py-1 px-2 border-b border-slate-700 hover:bg-slate-800 transition-colors duration-200"
                    >
                      <a href={`/${folder}/${filePathToUrl(file)}`}>
                        <div className="container mx-auto">
                          {filePathToMusicName(file, artist.name)}
                        </div>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
    </MainContainer>
  );
}

export default Folder;
