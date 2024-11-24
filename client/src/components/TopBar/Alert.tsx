import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";

type AlertProps = {
  message: string;
};

const Alert: FC<AlertProps> = ({ message }) => {
  return (
    <div
      className="flex items-center p-2 gap-1 max-h-[48px] max-w-[172px] text-sm text-blue-800 rounded-lg bg-blue-50 dark:bg-gray-800 dark:text-blue-400"
      role="alert"
    >
      <FontAwesomeIcon icon={faCircleExclamation} />
      <p className="font-semibold">{message}</p>
    </div>
  );
};

export default Alert;
