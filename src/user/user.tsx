import { useParams } from "react-router-dom";

function User() {
  const { id: username } = useParams<{ id: string }>();

  return <h1>Ici la page de {username}</h1>;
}

export default User;
