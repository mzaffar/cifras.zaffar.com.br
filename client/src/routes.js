import { Route, Routes } from "react-router-dom";

import FolderPage from "./pages/folder";
import HomePage from "./pages/home";
import ShowPage from "./pages/show";
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/:folder" element={<FolderPage />} />
      <Route path="/:folder/:artist/:music" element={<ShowPage />} />
    </Routes>
  );
}

export default AppRoutes;
