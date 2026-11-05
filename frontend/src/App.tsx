import { BrowserRouter, Routes, Route } from "react-router";

import { BrowsePage } from "./pages/main";
import { RecipePage } from "./pages/recipe";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/recipe/*" element={<RecipePage />} />
                <Route path="/*" element={<BrowsePage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;