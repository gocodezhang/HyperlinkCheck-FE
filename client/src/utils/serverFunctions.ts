import { GASClient } from "gas-client";
import * as server from "../../../server";

const { serverFunctions } = new GASClient<typeof server>();

export { serverFunctions } 