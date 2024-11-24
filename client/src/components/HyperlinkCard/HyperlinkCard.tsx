import { FC, useState } from "react";
import { serverFunctions } from "../../utils/serverFunctions";
import { useStore } from "../../zustand";
import { LinkCard } from "../../zustand/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLink } from "@fortawesome/free-solid-svg-icons";

import ValidateButton from "./ValidateButton";
import CircleLoader from "../CircleLoader";
import PassageContext from "./PassageContext";

type HyperlinkCardProps = {
  link: LinkCard;
};

const HyperlinkCard: FC<HyperlinkCardProps> = ({ link }) => {
  const links = useStore((state) => state.links);
  const setLinks = useStore((state) => state.setLinks);
  const setTotalNumberValidatedLinks = useStore(
    (state) => state.setTotalNumberValidatedLinks
  );
  const setTotalNumberBrokenLinks = useStore(
    (state) => state.setTotalNumberBrokenLinks
  );

  const [loading, setLoading] = useState<boolean>(false);

  async function handleValidate() {
    setLoading(true);
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
    setTotalNumberBrokenLinks();
    setLoading(false);
  }

  return (
    <div className="container p-1 bg-white border border-gray-200 rounded-lg shadow">
      <div className="card-item-container">
        <FontAwesomeIcon icon={faLink} />
        {"hyperlink: "}
        <a
          className="underline text-blue-600 break-all text-sm"
          href={link.hyperlink}
        >
          {link.hyperlink}
        </a>
      </div>
      <PassageContext
        src={link.hyperlink}
        linkedText={link.passage_context.linked_str}
        passageContext={link.passage_context.sentence}
      />
      <div className="flex justify-end items-center py-1 h-[40px]">
        {loading ? (
          <CircleLoader height={24} width={24} display="block" />
        ) : (
          <ValidateButton
            handleValidate={handleValidate}
            validation_code={link.validation_code}
          />
        )}
      </div>
    </div>
  );
};

export default HyperlinkCard;
