import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import BrowsingPage from "./pages/BrowsingPage";
import RecipePage from "./pages/RecipePage";

function App() {

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/browse" replace />} />
          <Route path="/browse/*" element={<BrowsingPage />} />
          <Route path="/recipe/*" element={<RecipePage />} />
        </Routes>
      </BrowserRouter>
  );
}

export default App
