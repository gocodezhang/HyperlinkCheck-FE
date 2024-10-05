import { FC } from "react";
import { Link } from "../../../server/searchContext";

type HyperlinkCardProps = {
  link: Link;
};

const HyperlinkCard: FC<HyperlinkCardProps> = ({ link }) => {
  return (
    <div>
      <a href={link.hyperlink}>{link.hyperlink}</a>
      <p>{link.passage_context.sentence}</p>
    </div>
  );
};

export default HyperlinkCard;
