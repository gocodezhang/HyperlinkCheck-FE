import { useEffect, useState } from "react";
import { serverFunctions } from "../utils/serverFunctions";
import { useStore } from "../zustand";

import TopBar from "./TopBar/TopBar";
import HyperlinkCard from "./HyperlinkCard/HyperlinkCard";
import LandingLoader from "./LanndingLoader";

/* ---------------- Dev only (Comment before push) -------------- */
import { mockedLinks } from "../utils/mockData";

function SideBar() {
  const links = useStore((state) => state.links);
  const totalNumberBrokenLinks = useStore(
    (state) => state.totalNumberBrokenLinks
  );
  const totalNumberValidatedLinks = useStore(
    (state) => state.totalNumberValidatedLinks
  );

  const setLinks = useStore((state) => state.setLinks);
  const setTotalNumberValidatedLinks = useStore(
    (state) => state.setTotalNumberValidatedLinks
  );
  const setTotalNumberBrokenLinks = useStore(
    (state) => state.setTotalNumberBrokenLinks
  );

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    async function getLinks() {
      /* ---------------- For Prod (unComment before push) -------------- */
      // setLinks((await serverFunctions.findHyperLinks()) || []);

      // /* ---------------- Dev only (Comment before push) -------------- */
      setLinks(mockedLinks);
      setTotalNumberValidatedLinks();
      setTotalNumberBrokenLinks();
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
    setLoading(true);
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
    setTotalNumberBrokenLinks();
    setLoading(false);
  }

  return (
    <div className="container py-2 h-full flex flex-col justify-center items-center">
      {links.length === 0 ? (
        <LandingLoader />
      ) : (
        <>
          <TopBar
            totalNumberLinks={links.length}
            totalNumberBrokenLinks={totalNumberBrokenLinks}
            totalNumberValidatedLinks={totalNumberValidatedLinks}
            handleValidateAllLinks={handleValidateAllLinks}
            loading={loading}
          />
          <div className="flex flex-col gap-4 px-4 w-full max-h-[85vh] overflow-y-auto overflow-x-hidden">
            {links.map((link, i) => (
              <HyperlinkCard key={i} link={link} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default SideBar;
