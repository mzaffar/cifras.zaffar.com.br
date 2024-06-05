import { mdiDotsVertical, mdiPencil } from "@mdi/js";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Chord from "../components/Chord";
import FontSize from "../components/FontSize";
import Header from "../components/Header";
import IconButton from "../components/IconButton";
import MainContainer from "../components/MainContainer";
import Modal from "../components/Modal";
import ScrollDown from "../components/ScrollDown";
import Scroller from "../components/Scroller";
import ShowChord from "../components/ShowChord";
import SimpleButton from "../components/SimpleButton";
import { config } from "../config";
import { fontSizes } from "../utils";

function Show() {
  const navigate = useNavigate();
  const { folder, artist, music } = useParams();
  const [musicData, setMusicData] = useState();
  const [musicOriginal, setMusicOriginal] = useState();
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);
  const [fontSize, setFontSize] = useState(2);
  const [editingMusic, setEditingMusic] = useState(false);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [showChord, setShowChord] = useState();
  const [showChordPosition, setShowChordPosition] = useState();
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    getMusicFile();
  }, []);

  useEffect(() => {
    if (musicData)
      document.title = `${musicData.music.name} - ${musicData.artist.name}`;
  }, [musicData]);

  useEffect(() => {
    adjustTextareaHeight();
  }, [editingMusic]);

  useEffect(() => {
    const handleClick = (event) => {
      if (
        event.target.tagName === "B" &&
        event.target.parentNode.tagName === "PRE"
      ) {
        setShowChord(event.target.innerText);

        // get the mouse click position x and y count the offset of the parent element
        const x = event.clientX;
        const y = event.clientY;
        const bodyX = x + window.scrollX;
        const bodyY = y + window.scrollY;

        setShowChordPosition({
          x: bodyX - 57,
          y: bodyY - 62,
        });
      } else {
        setShowChord();
        setShowChordPosition();

        const x = event.clientX;
        const y = event.clientY;
        const bodyX = x + window.scrollX;
        const bodyY = y + window.scrollY;
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  const getMusicFile = () => {
    setLoading(true);
    fetch(
      `${config.api_url}/music/show?folder=${encodeURIComponent(
        folder
      )}&artist=${encodeURIComponent(artist)}&music=${encodeURIComponent(
        music
      )}`
    )
      .then((res) => res.json())
      .then((res) => {
        setMusicData(res);
        setMusicOriginal(res.music.music);
        setLoading(false);
        adjustTextareaHeight();
      });
  };

  const reimport = () => {
    setLoading(true);
    fetch(
      `${config.api_url}/music/import?folder=${folder}&url=${musicData.music.url_clifraclub}`
    )
      .then((res) => res.json())
      .then((res) => {
        toast("Música re-importada.", {
          type: "success",
        });
        setShowOptions(false);
        setLoading(false);
        navigate(`/${folder}/${artist}/${music}`);
      })
      .catch((err) => {
        toast("Erro ao re-importar música. Tente novamente.", {
          type: "error",
        });
        setLoading(false);
      });
  };

  const updateMusicHandler = () => {
    setLoading(true);
    fetch(`${config.api_url}/music/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ json: musicData }),
    })
      .then((res) => res.json())
      .then((res) => {
        toast("Música editada.", {
          type: "success",
        });
        setLoading(false);
        setMusicData(res);
        setEditingMusic(false);
        setShowSaveButton(false);
      });
  };

  const deleteMusicHandler = () => {
    setLoading(true);
    fetch(`${config.api_url}/music/delete?path=${musicData.path}`)
      .then((res) => {
        if (res.status !== 200) {
          res
            .json()
            .then((errorJson) => {
              setLoading(false);
              toast(
                "Erro ao deletar música: " +
                  (errorJson.error || "Desconhecido"),
                {
                  type: "error",
                }
              );
            })
            .catch((jsonError) => {
              setLoading(false);
              toast(
                "Erro ao deletar música: " +
                  (jsonError.error || "Desconhecido"),
                {
                  type: "error",
                }
              );
            });
        } else {
          setLoading(false);
          return res.json();
        }
      })
      .then((data) => {
        if (data) {
          toast("Música excluída.", {
            type: "success",
          });
          setLoading(false);
          navigate(`/${folder}`);
        }
      })
      .catch((fetchError) => {
        setLoading(false);
        toast("Erro na requisição: " + fetchError.error, {
          type: "error",
        });
      });
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const editMusicHandler = (value) => {
    const newMusicData = { ...musicData };
    newMusicData.music.music = value;
    setMusicData(newMusicData);

    setShowSaveButton(true);
  };

  const cancelUpdateHandler = () => {
    getMusicFile();
    setLoading(false);
    setEditingMusic(false);
    setShowSaveButton(false);
  };

  if (!musicData) {
    return (
      <MainContainer>
        <Header />
      </MainContainer>
    );
  }

  return (
    <MainContainer>
      <Header backTo={() => navigate(`/${folder}`)}>
        <IconButton
          path={mdiPencil}
          size={"1rem"}
          color="bg-blue-800"
          onClick={() => setEditingMusic(!editingMusic)}
          loading={loading}
        />
        <IconButton
          path={mdiDotsVertical}
          size={"1rem"}
          color="bg-blue-800"
          onClick={() => setShowOptions(true)}
        />
      </Header>

      {showOptions && (
        <Modal title="Opções">
          <div className="p-2 space-y-2">
            <SimpleButton
              label="Ver no Cifra Club"
              color="bg-slate-800"
              className="text-center"
              onClick={() =>
                window.open(musicData.music.url_clifraclub, "_blank").focus()
              }
            />
            <SimpleButton
              label={"Re-importar"}
              onClick={() => reimport()}
              className="text-center"
              color="bg-slate-800"
              loading={loading}
            />
            <SimpleButton
              label="Excluir música"
              className="text-center"
              color="bg-red-800"
              onClick={() => deleteMusicHandler()}
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

      {showChord && (
        <ShowChord
          musicData={musicData}
          chord_name={showChord}
          showChordPosition={showChordPosition}
        />
      )}
      <div className="bg-slate-800 p-2 ">
        <div className="container mx-auto flex items-center">
          <div>
            <div className="text-slate-400 text-2xl">
              {musicData.music.name}
            </div>
            <div className="text-slate-400 text-xs">
              {musicData.artist.name}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto overflow-auto ">
        <div className="flex py-2">
          <div className="grow">
            {showSaveButton && (
              <div className={"space-x-2 flex"}>
                <SimpleButton
                  label="Salvar"
                  className="w-fit"
                  onClick={() => updateMusicHandler()}
                />
                <SimpleButton
                  label="Cancelar"
                  color="bg-red-800"
                  className="w-fit"
                  onClick={() => cancelUpdateHandler()}
                />
              </div>
            )}
          </div>
          <div className="flex space-x-2 mr-2 md:mr-0">
            {/* Scroll Down */}
            <ScrollDown />
            {/* Scroller */}
            <Scroller />
            {/* Font Size */}
            <FontSize fontSize={fontSize} setFontSize={setFontSize} />
          </div>
        </div>

        {/* Music */}
        <pre
          className={
            "py-4 px-2 text-slate-400 " +
            fontSizes[fontSize] +
            (editingMusic ? " hidden" : " block")
          }
          dangerouslySetInnerHTML={{ __html: musicData.music.music + "<br>" }}
        ></pre>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className={
            "w-full  bg-slate-800 p-2 " + (editingMusic ? "block" : "hidden")
          }
          value={musicData.music.music}
          onChange={(e) => editMusicHandler(e.target.value)}
        ></textarea>

        {/* Chords */}
        <div>
          <div className="flex flex-wrap">
            {musicData.music.chords.map((chord, i) => {
              return <div key={i}>{<Chord chord={chord} />}</div>;
            })}
          </div>
        </div>
      </div>
    </MainContainer>
  );
}

export default Show;
