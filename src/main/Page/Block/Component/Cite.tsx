import type { MakeState } from "../../../../types/Set";

import { Text } from "./ComponentDeBase/Text";

import "/src/styles/main/Page/Block/Component/Cite.scss";

function Cite({
  children: content,
  onChange,
  onKeyDown,
  registerRef,
}: {
  children: string;
  onChange: MakeState<React.ChangeEvent<HTMLInputElement>>;
  onKeyDown?: MakeState<React.KeyboardEvent<HTMLInputElement>>;
  registerRef?: (el: HTMLInputElement | null) => void;
}) {
  return (
    <Text
      placeholder={"Citation..."}
      ClassName="Cite"
      onChange={onChange}
      onKeyDown={onKeyDown}
      registerRef={registerRef}
    >
      {content}
    </Text>
  );
}

export default Cite;
