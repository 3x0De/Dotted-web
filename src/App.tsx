import { Routes, Route, useParams, Navigate } from "react-router-dom";
import AppMain from "./main/AppMain";
import Login from "./Login/Login";
import SignUp from "./Signup/Signup";

function App() {
  return (
    <Routes>
      <Route path="/:id" element={<PageRouter />} />
      <Route path="/Signup" element={<SignUp />} />
      <Route path="/Login" element={<Login />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

function PageRouter() {
  const { id } = useParams();
  const isValid = /^\d+$/.test(id ?? "");

  if (!isValid) return <Navigate to={"/Login"} />;
  else return <AppMain />;
}

export default App;
