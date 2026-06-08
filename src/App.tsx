import AppMain from "./main/AppMain";
import Login from "./Login/Login";
// App.tsx
import { Routes, Route } from "react-router-dom";
// import Home from './pages/Home'
// import About from './pages/About'
// import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/1" element={<AppMain />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
}

export default App;
