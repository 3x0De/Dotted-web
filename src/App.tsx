import { Routes, Route } from "react-router-dom";
import AppMain from "./main/AppMain";
import Login from "./Login/Login";
import SignUp from "./Signup/Signup";

function App() {
  return (
    <Routes>
      <Route path="/1" element={<AppMain />} />
      <Route path="/Signup" element={<SignUp />} />
      <Route path="/Login" element={<Login />} />
    </Routes>
  );
}

export default App;
