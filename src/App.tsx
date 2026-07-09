import { BrowserRouter, Routes, Route } from "react-router-dom";

import Principal from "./main/Principal";

import "./styles/App.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Principal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
