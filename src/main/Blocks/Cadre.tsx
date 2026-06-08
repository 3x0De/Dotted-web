import "../../Styles/main/Blocks/Cadre.scss";

interface CadreProps {
  innerRef: React.RefObject<any>;
  children?: React.ReactNode;
}

function Cadre({ innerRef, children }: CadreProps) {
  return (
    <div ref={innerRef} id="Cadre">
      {children}
    </div>
  );
}

export default Cadre;
