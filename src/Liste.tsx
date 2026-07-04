import { Text } from "./Text";
import type {
  Liste,
  Listede,
  OrdreListItem,
  TodoListItem,
} from "./types/Liste";
import "./styles/Liste.scss";

function List({
  id,
  children: content,
  onChange,
  onKeyDown,
  registerRef,
  onAddItem,
  onRemoveItem,
}: {
  id: number;
  children: Liste;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    blockId: number,
    itemId: number,
  ) => void;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement>,
    itemId: number,
  ) => void;
  registerRef?: (id: number, el: HTMLInputElement | null) => void;
  onAddItem: (afterId: number) => void;
  onRemoveItem: (blockId: number, itemId: number) => void;
}) {
  return (
    <>
      {"state" in content[0]
        ? (content as Listede<TodoListItem>).map((el, idx) => (
            <div className="li" key={el.Id}>
              <div className="checkbox">
                <input
                  type="checkbox"
                  checked={el.state}
                  onChange={(e) => {
                    e.target.type = "checkbox";
                    e.target.checked = !el.state;
                    e.target.value = el.contenu;
                    onChange(e, id, el.Id);
                  }}
                />
              </div>
              <Text
                placeholder="Tâche..."
                onChange={(e) => onChange(e, id, el.Id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAddItem(el.Id);
                    return;
                  }

                  if (e.key === "Backspace") {
                    if (el.contenu === "") {
                      e.preventDefault();
                      onRemoveItem(id, el.Id);

                      if (idx > 0) {
                        const prevElement = content[idx - 1];
                        setTimeout(() => {
                          const elHtml = document.getElementById(
                            `input-${prevElement.Id}`,
                          );
                          elHtml?.focus();
                        }, 0);
                      }
                      return;
                    }
                  }

                  onKeyDown?.(e, el.Id);
                }}
                registerRef={(input) => {
                  if (input) input.id = `input-${el.Id}`;
                  registerRef?.(el.Id, input);
                }}
              >
                {el.contenu}
              </Text>
            </div>
          ))
        : (content as Listede<OrdreListItem>).map((el, idx) => (
            <li key={el.Id}>
              <Text
                placeholder="Tâche..."
                onChange={(e) => onChange(e, id, el.Id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    onAddItem(el.Id);
                    return;
                  }

                  if (e.key === "Backspace") {
                    if (el.contenu === "") {
                      e.preventDefault();
                      onRemoveItem(id, el.Id);

                      if (idx > 0) {
                        const prevElement = content[idx - 1];
                        setTimeout(() => {
                          const elHtml = document.getElementById(
                            `input-${prevElement.Id}`,
                          );
                          elHtml?.focus();
                        }, 0);
                      }
                      return;
                    }
                  }

                  onKeyDown?.(e, el.Id);
                }}
                registerRef={(input) => {
                  if (input) input.id = `input-${el.Id}`;
                  registerRef?.(el.Id, input);
                }}
              >
                {el.contenu}
              </Text>
            </li>
          ))}
    </>
  );
}

function Ul({
  id,
  children: content,
  onChange,
  onKeyDown,
  registerRef,
  onAddItem,
  onRemoveItem,
}: {
  id: number;
  children: Listede<OrdreListItem>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    itemId?: number,
  ) => void;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement>,
    itemId: number,
  ) => void;
  registerRef?: (id: number, el: HTMLInputElement | null) => void;
  onAddItem: (afterId: number) => void;
  onRemoveItem: (blockId: number, itemId: number) => void;
}) {
  return (
    <ul className="Liste">
      <List
        id={id}
        onChange={onChange}
        onKeyDown={onKeyDown}
        registerRef={registerRef}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
      >
        {content}
      </List>
    </ul>
  );
}

function Ol({
  id,
  children: content,
  onChange,
  onKeyDown,
  registerRef,
  onAddItem,
  onRemoveItem,
}: {
  id: number;
  children: Listede<OrdreListItem>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    itemId?: number,
  ) => void;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement>,
    itemId: number,
  ) => void;
  registerRef?: (id: number, el: HTMLInputElement | null) => void;
  onAddItem: (afterId: number) => void;
  onRemoveItem: (blockId: number, itemId: number) => void;
}) {
  return (
    <ol className="Liste">
      <List
        id={id}
        onChange={onChange}
        onKeyDown={onKeyDown}
        registerRef={registerRef}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
      >
        {content}
      </List>
    </ol>
  );
}

function Todo({
  id,
  children: content,
  onChange,
  onKeyDown,
  registerRef,
  onAddItem,
  onRemoveItem,
}: {
  id: number;
  children: Listede<TodoListItem>;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>,
    id: number,
    itemId?: number,
  ) => void;
  onKeyDown?: (
    e: React.KeyboardEvent<HTMLInputElement>,
    itemId: number,
  ) => void;
  registerRef?: (id: number, el: HTMLInputElement | null) => void;
  onAddItem: (afterId: number) => void;
  onRemoveItem: (blockId: number, itemId: number) => void;
}) {
  return (
    <div className="Liste">
      <List
        id={id}
        onChange={onChange}
        onKeyDown={onKeyDown}
        registerRef={registerRef}
        onAddItem={onAddItem}
        onRemoveItem={onRemoveItem}
      >
        {content}
      </List>
    </div>
  );
}

const Listes = { Ul, Ol, Todo };
export default Listes;
