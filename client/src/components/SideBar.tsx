import { useEffect, useState } from "react";
import { Link } from "../../../server/searchContext";
import HyperlinkCard from "./HyperlinkCard";
import Loader from "./Loader";
import { serverFunctions } from "../utils/serverFunctions";

/* ---------------- Comment before push -------------- */
// import { mockedLinks } from "../utils/mockData";

function SideBar() {
  const [links, Setlinks] = useState<Link[]>([]);

  useEffect(() => {
    async function getLinks() {
      Setlinks((await serverFunctions.findHyperLinks()) || []);

      /* ---------------- Comment before push -------------- */
      // Setlinks(mockedLinks);
    }
    getLinks();
  }, []);

  return links.length === 0 ? (
    <Loader />
  ) : (
    <div>
      {links.map((link, i) => (
        <HyperlinkCard key={i} link={link} />
      ))}
    </div>
  );
}

export default SideBar;
