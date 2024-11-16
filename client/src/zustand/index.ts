import { create } from "zustand";
import { LinkCard } from "./types";

interface SideBarStore {
  links: LinkCard[]
  totalNumberValidatedLinks: number
  setLinks: (newLinks: LinkCard[]) => void
  setTotalNumberValidatedLinks: () => void
}

export const useStore = create<SideBarStore>((set) => ({
  totalNumberValidatedLinks: 0,
  links: [],
  setLinks: (newLinks) => set({links: newLinks}),
  setTotalNumberValidatedLinks: () => set((state) => (
    {totalNumberValidatedLinks: state.links.filter((links) => (links.validation_code !== undefined)).length}))
}))