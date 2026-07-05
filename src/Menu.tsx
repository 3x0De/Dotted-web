import Block from "./Block";
import { Text } from "./Text";
import type { MakeState } from "./types/Set";
import type { EditorState } from "./types/Wrapper";
import type { TYPE } from "./types/menu";
import "./styles/Menu.scss";

function BlockMenu({
  id,
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
  children: { nom: string; content: EditorState[] };
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
    <details className="MenuBlock">
      <summary>
        <Text
          placeholder="Menu..."
          onChange={(e) => onChange(e, id)}
          onKeyDown={(e) => onKeyDown(e, id)}
          registerRef={(el) => registerRef(id, el)}
        >
          {content.nom}
        </Text>
      </summary>
      <div className="MenuContent">
        {content.content.map((el) => (
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
    </details>
  );
}

export default BlockMenu;
