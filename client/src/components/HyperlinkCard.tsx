import { FC } from "react";
import { serverFunctions } from "../utils/serverFunctions";
import { useStore } from "../zustand";
import { LinkCard } from "../zustand/types";

type HyperlinkCardProps = {
  link: LinkCard;
};

const HyperlinkCard: FC<HyperlinkCardProps> = ({ link }) => {
  const links = useStore((state) => state.links);
  const setLinks = useStore((state) => state.setLinks);
  const setTotalNumberValidatedLinks = useStore(
    (state) => state.setTotalNumberValidatedLinks
  );

  async function handleValidate() {
    const results = await serverFunctions.validateLinks([link]);
    const updatedLinks = links.map((linkCard) => {
      if (linkCard.hyperlink === link.hyperlink) {
        linkCard.validation_code = results[0].validation_code;
        linkCard.scores = results[0].scores;
      }
      return linkCard;
    });

    setLinks(updatedLinks);
    setTotalNumberValidatedLinks();
  }

  return (
    <div className="container mx-auto border-solid border-2">
      <div>
        <button
          type="button"
          onClick={handleValidate}
          disabled={link.validation_code === undefined ? false : true}
        >
          {link.validation_code === undefined ? "Validate" : "Validated"}
        </button>
        <a href={link.hyperlink}>{link.hyperlink}</a>
      </div>
      <p>{link.passage_context.sentence}</p>
    </div>
  );
};

export default HyperlinkCard;
