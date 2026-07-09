import { BrowserRouter, Routes, Route } from "react-router-dom";

import Principal from "./main/Principal";
import LogIn from "./auth/Login";
import SignUp from "./auth/Signup";

import "./styles/App.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Principal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
