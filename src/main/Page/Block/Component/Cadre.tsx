import type { MakeState } from "../../../../types/Set";
import type { EditorState } from "../../../../types/MainTypes/Wrapper";
import type { TYPE } from "../../../../types/MainTypes/BlockTypes/menu";

import Block from "../Block";

import "/src/styles/main/Page/Block/Component/Cadre.scss";

function Cadre({
  children: content,
  onChange,
  onKeyDown,
  registerRef,
  settype,
  onAddItem,
  onRemoveItem,
  onAddListItem,
  onRemoveListItem,
}: {
  id: number;
  children: EditorState[];
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    targetId: number,
    itemId?: number,
  ) => void;
  onKeyDown: (
    e: React.KeyboardEvent<HTMLInputElement>,
    targetId: number,
    itemId?: number,
  ) => void;
  registerRef: (id: number, el: HTMLInputElement | null) => void;
  settype: MakeState<{ newType: TYPE; targetId: number }>;
  onAddItem: MakeState<number>;
  onRemoveItem: MakeState<number>;
  onAddListItem?: (blockId: number, afterId: number) => void;
  onRemoveListItem?: (blockId: number, itemId: number) => void;
}) {
  const handleAddListItem = (blockId: number, afterId: number) => {
    onAddListItem?.(blockId, afterId);
  };
  const handleRemoveListItem = (blockId: number, itemId: number) => {
    onRemoveListItem?.(blockId, itemId);
  };

  return (
    <div className="Cadre">
      {content.map((el) => (
        <Block
          key={el.id}
          onChange={onChange}
          onKeyDown={onKeyDown}
          settype={settype}
          onAddItem={onAddItem}
          onRemoveItem={onRemoveItem}
          registerRef={registerRef}
          onAddListItem={handleAddListItem}
          onRemoveListItem={handleRemoveListItem}
        >
          {el}
        </Block>
      ))}
    </div>
  );
}
export default Cadre;
