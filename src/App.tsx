import { Routes, Route, useParams, Navigate } from "react-router-dom";
import AppMain from "./main/AppMain";
import Login from "./Login/Login";
import SignUp from "./Signup/Signup";
import Error from "./401/401";
import { useEffect, useState } from "react";

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
  const { id } = useParams<{ id: string }>();

  const [maxId, setMaxId] = useState<number | null>(null);

  const [canConnect, setCanConnect] = useState<boolean | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const isValidFormat = /^\d+$/.test(id ?? "");

  useEffect(() => {
    if (!isValidFormat) {
      setLoading(false);
      return;
    }

    async function fetchAllChecks() {
      try {
        const [resMaxId, resPeuxCon] = await Promise.all([
          fetch("http://localhost:8000/maxId"),
          fetch(`http://localhost:8000/peuxCon/${id}`),
        ]);

        const dataMaxId = await resMaxId.json();
        const dataPeuxCon = await resPeuxCon.json();

        setMaxId(Number(dataMaxId));
        setCanConnect(dataPeuxCon);
      } catch (error) {
        console.error("Erreur lors des vérifications :", error);
        setCanConnect(false);
      } finally {
        setLoading(false);
      }
    }

    fetchAllChecks();
  }, [id, isValidFormat]);

  if (!isValidFormat) {
    return <Navigate to="/Login" replace />;
  }

  if (loading) {
    return <h1>Chargement...</h1>;
  }

  const isIdInInterval = id && maxId !== null && Number(id) <= maxId;
  const isSqlAllowed = canConnect === true;

  if (isSqlAllowed) {
    return <AppMain />;
  } else if (!isIdInInterval) {
    return <Navigate to="/1" />;
  } else {
    return <Error />;
  }
}

export default App;
