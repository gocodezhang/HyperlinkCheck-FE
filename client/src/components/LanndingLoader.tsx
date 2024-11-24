import { FC } from "react";
import CircleLoader from "./CircleLoader";

const LandingLoader: FC = () => {
  return (
    <>
      <CircleLoader height={64} width={64} display="block" />
      <p>Finding links in the docs...</p>
    </>
  );
};

export default LandingLoader;
