import "../../Styles/main/Blocks/Picture.scss";
import bin from "../../assets/Image/Block logo/bin.svg";
import scale from "../../assets/Image/Block logo/scale.svg";

function Picture({
  content,
}: {
  content?: { img: string; size?: { height: number; width: number } };
}) {
  return (
    <div className="Picture">
      {content ? (
        <>
          <img
            src={content.img}
            width={content.size ? content.size.width : ""}
            height={content.size ? content.size.height : ""}
          />
          <img src={bin} />
          <img src={scale} />
        </>
      ) : (
        <input type="file" />
      )}
    </div>
  );
}

export default Picture;
