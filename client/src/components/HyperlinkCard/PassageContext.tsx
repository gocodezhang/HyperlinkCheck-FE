import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-solid-svg-icons";

type PassgaeContextProps = {
  src: string;
  linkedText: string;
  passageContext: string;
};

const PassageContext: FC<PassgaeContextProps> = ({
  src,
  linkedText,
  passageContext,
}) => {
  const beforeLinkIndex = passageContext.indexOf(linkedText);
  const afterLinkIndex = beforeLinkIndex + linkedText.length;

  return (
    <div className="card-item-container">
      <span>
        <FontAwesomeIcon icon={faFileLines} />
        {"corresponding text in docs: "}
      </span>
      <p className="p-1 border-gray-300 bg-gray-100 text-gray-500 text-sm">
        {passageContext.substring(0, beforeLinkIndex)}
        <a className="underline text-blue-600" href={src}>
          {passageContext.substring(beforeLinkIndex, afterLinkIndex)}
        </a>
        {passageContext.substring(afterLinkIndex)}
      </p>
    </div>
  );
};

export default PassageContext;
