// import React from 'react';
import { useEffect, useState } from "react";
import { Link } from "../../../server/searchContext";
import HyperlinkCard from "./HyperlinkCard";
import Loader from "./Loader";
import { GASClient } from "gas-client";
import * as server from "../../../server";

function SideBar() {
  const [links, Setlinks] = useState<Link[]>([]);
  const { serverFunctions } = new GASClient<typeof server>({
    allowedDevelopmentDomains: "https://localhost:5173",
  });

  useEffect(() => {
    async function getLinks() {
      Setlinks((await serverFunctions.findHyperLinks()) || []);
    }
    getLinks();
  }, []);

  return links.length === 0 ? (
    <Loader />
  ) : (
    <div>
      {links.map((link) => (
        <HyperlinkCard link={link} />
      ))}
    </div>
  );
}

export default SideBar;
