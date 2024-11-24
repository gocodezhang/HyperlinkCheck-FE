import { FC } from "react";
import CircleLoader from "../CircleLoader";
import Alert from "./Alert";

type TopBarProps = {
  totalNumberLinks: number;
  totalNumberBrokenLinks: number;
  totalNumberValidatedLinks: number;
  handleValidateAllLinks: () => Promise<void>;
  loading: boolean;
};

const TopBar: FC<TopBarProps> = ({
  totalNumberLinks,
  totalNumberBrokenLinks,
  totalNumberValidatedLinks,
  handleValidateAllLinks,
  loading,
}) => {
  function buildMessage() {
    // if user has not validated any links, show # total links
    if (totalNumberValidatedLinks === 0) {
      return `${totalNumberLinks} hyperlinks found`;
    }

    // if user has validated some links
    if (totalNumberBrokenLinks > 0) {
      // proritize showing broken links
      return `${totalNumberBrokenLinks} broken links found`;
    } else if (totalNumberLinks - totalNumberValidatedLinks > 0) {
      // show remaining links to be validated
      return `${
        totalNumberLinks - totalNumberValidatedLinks
      } hyperlinks to be validated`;
    } else {
      // else show no issue message
      return `No issues found`;
    }
  }

  const alertMessage = buildMessage();

  return (
    <div className="w-full flex flex-row justify-between px-4 mb-2 h-[5vh]">
      <Alert message={alertMessage} />
      <button
        type="button"
        onClick={handleValidateAllLinks}
        disabled={totalNumberLinks === totalNumberValidatedLinks}
        className="primary-button text-sm max-h-[36px] min-w-[85px] ml-2"
      >
        {loading && <CircleLoader height={24} width={24} display="inline" />}
        {loading ? "Validating" : "Validate All"}
      </button>
    </div>
  );
};

export default TopBar;
