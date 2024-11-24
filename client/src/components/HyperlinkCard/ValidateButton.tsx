import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faCircleCheck,
} from "@fortawesome/free-solid-svg-icons";

type ValidateButtonProps = {
  handleValidate: () => Promise<void>;
  validation_code?: number;
};

const ValidateButton: FC<ValidateButtonProps> = ({
  handleValidate,
  validation_code,
}) => {
  // if we haven't validate this link, show validate button
  if (validation_code === undefined) {
    return (
      <button
        type="button"
        onClick={handleValidate}
        className="primary-button text-xs"
      >
        Validate
      </button>
    );
  }

  // else show status
  return (
    <FontAwesomeIcon
      icon={validation_code === 0 ? faCircleCheck : faCircleExclamation}
      size="lg"
      style={{ color: validation_code === 0 ? "#22c55e" : "#ef4444" }}
    />
  );
};

export default ValidateButton;
