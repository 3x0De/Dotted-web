import { STATE } from "./types/menu";
import Wrapper from "./Wrapper";

function Page() {
  return (
    <Wrapper
      init={{
        id: 0,
        type: STATE.col,
        content: [
          { id: Math.random(), type: STATE.h1, content: "1" },
          { id: Math.random(), type: STATE.h1, content: "2" },
          {
            id: Math.random(),
            type: STATE.row,
            content: [
              {
                id: Math.random(),
                type: STATE.col,
                content: [
                  { id: Math.random(), type: STATE.h1, content: "1" },
                  { id: Math.random(), type: STATE.h1, content: "2" },
                ],
              },
              {
                id: Math.random(),
                type: STATE.col,
                content: [{ id: Math.random(), type: STATE.h1, content: "1" }],
              },
            ],
          },
        ],
      }}
    />
  );
}

export default Page;
