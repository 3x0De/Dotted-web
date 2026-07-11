import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
} from "react-router-dom";
import { useState, useEffect } from "react";

import Principal from "./main/Principal";
import LogIn from "./auth/Login";
import SignUp from "./auth/Signup";
import Error401 from "./error/401";
import Error404 from "./error/404";
import Error418 from "./error/418";
import UserPage from "./user/user";
import Loading from "./loading/loading";

import "./styles/App.scss";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LogIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/Page/:id" element={<Page />} />
        <Route
          path="/"
          element={<Navigate to={import.meta.env.VITE_PAGE_1} />}
        />
        <Route path="/418" element={<Error418 />} />
        <Route path="/:id" element={<User />} />
        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

function Page() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<"loading" | "ok" | "unauthorized">(
    "loading",
  );

  useEffect(() => {
    async function getPages() {
      const request = await fetch(`${import.meta.env.VITE_API_URL}/Page`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prive: true, racine: false }),
      });

      return await request.json();
    }

    getPages().then((list: string[]) => {
      if (list.includes(`/Page/${id}`)) {
        setStatus("ok");
      } else {
        setStatus("unauthorized");
      }
    });
  }, [id]);

  if (status === "loading") return <Loading />;
  if (status === "unauthorized") return <Error401 />;
  return <Principal />;
}

function User() {
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<"loading" | "ok" | "404">("loading");

  useEffect(() => {
    async function getUsers() {
      const request = await fetch(`${import.meta.env.VITE_API_URL}/User`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      return await request.json();
    }

    getUsers().then((list: string[]) => {
      if (list.includes(`/User/${id}`)) {
        setStatus("ok");
      } else {
        setStatus("404");
      }
    });
  }, [id]);

  if (status === "loading") return <Loading />;
  if (status === "404") return <Error404 />;
  return <UserPage />;
}

export default App;
