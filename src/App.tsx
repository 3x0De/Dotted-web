import { BrowserRouter, Routes, Route } from "react-router-dom";

import Principal from "./main/Principal";
import LogIn from "./auth/Login";
import SignUp from "./auth/Signup";
import Error404 from "./error/404";
import Error401 from "./error/401";

import "./styles/App.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/404" element={<Error404 />} />
        <Route path="/401" element={<Error401 />} />
        <Route path="*" element={<Principal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
