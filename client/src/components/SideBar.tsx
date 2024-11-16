import { useEffect } from "react";
import HyperlinkCard from "./HyperlinkCard";
import Loader from "./Loader";
import { serverFunctions } from "../utils/serverFunctions";
import { useStore } from "../zustand";

/* ---------------- Dev only (Comment before push) -------------- */
// import { mockedLinks } from "../utils/mockData";

function SideBar() {
  const links = useStore((state) => state.links);
  const totalNumberValidatedLinks = useStore(
    (state) => state.totalNumberValidatedLinks
  );
  const setLinks = useStore((state) => state.setLinks);
  const setTotalNumberValidatedLinks = useStore(
    (state) => state.setTotalNumberValidatedLinks
  );

  useEffect(() => {
    async function getLinks() {
      /* ---------------- For Prod (unComment before push) -------------- */
      setLinks((await serverFunctions.findHyperLinks()) || []);

      // /* ---------------- Dev only (Comment before push) -------------- */
      // setLinks(mockedLinks);
      setTotalNumberValidatedLinks();
    }
    getLinks();
  }, []);

  async function handleValidateAllLinks() {
    // find indices of links need validation
    const validateIndices: number[] = [];
    links.forEach((link, i) => {
      if (link.validation_code === undefined) {
        validateIndices.push(i);
      }
    });
    // validate links that have not been validated
    const result = await serverFunctions.validateLinks(
      validateIndices.map((index) => links[index])
    );

    // update links that just got validated
    const updatedLinks = [...links];
    for (let i = 0; i < validateIndices.length; i++) {
      const indexInList = validateIndices[i];
      updatedLinks[indexInList].validation_code = result[i].validation_code;
      updatedLinks[indexInList].scores = result[i].scores;
    }
    setLinks(updatedLinks);
    setTotalNumberValidatedLinks();
  }

  if (links.length === 0) {
    return <Loader />;
  }

  return (
    <div>
      <div>
        <button type="button" onClick={handleValidateAllLinks}>
          Validate All
        </button>
        <p>{`${totalNumberValidatedLinks}/${links.length}`}</p>
      </div>
      <div className="flex flex-col gap-4 p-4">
        {links.map((link, i) => (
          <HyperlinkCard key={i} link={link} />
        ))}
      </div>
    </div>
  );
}

export default SideBar;
