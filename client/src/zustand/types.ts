import { Link } from "../../../server/searchContext";

export interface LinkCard extends Link {
  validation_code?: number
  scores?: number[] 
}