import { mdiArrowLeftCircle } from "@mdi/js";
import { useNavigate } from "react-router-dom";
import IconButton from "./IconButton";

function Header({ children, backTo, title = "Musicas" }) {
  const navigate = useNavigate();
  const gotoHome = () => {
    navigate("/");
  };

  return (
    <div className="bg-main w-full p-2 content-center">
      <div className="container mx-auto text-slate-300 flex  content-center">
        {backTo && (
          <div className="flex">
            <div>
              <IconButton
                color="bg-main"
                path={mdiArrowLeftCircle}
                size={"1.5rem"}
                className={" text-slate-500"}
                onClick={backTo}
              />
            </div>
          </div>
        )}
        <div
          className="grow font-bold content-center cursor-pointer"
          onClick={() => gotoHome()}
        >
          {title}
        </div>
        <div className="flex space-x-2 content-center">{children}</div>
      </div>
    </div>
  );
}

export default Header;
