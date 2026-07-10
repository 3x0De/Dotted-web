import { BrowserRouter, Routes, Route } from "react-router-dom";

import Principal from "./main/Principal";
import LogIn from "./auth/Login";
import SignUp from "./auth/Signup";
import Error401 from "./error/401";
import Error403 from "./error/403";
import Error404 from "./error/404";
import Error418 from "./error/418";
import Error500 from "./error/500";

import "./styles/App.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/401" element={<Error401 />} />
        <Route path="/403" element={<Error403 />} />
        <Route path="/404" element={<Error404 />} />
        <Route path="/418" element={<Error418 />} />
        <Route path="/500" element={<Error500 />} />
        <Route path="*" element={<Principal />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
