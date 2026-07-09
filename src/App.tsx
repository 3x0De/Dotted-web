import { BrowserRouter, Routes, Route } from "react-router-dom";

import Principal from "./main/Principal";
import Login from "./auth/Login";

import "./styles/App.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="*" element={<Principal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
