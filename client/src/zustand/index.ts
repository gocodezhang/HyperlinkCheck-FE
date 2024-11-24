import { create } from "zustand";
import { LinkCard } from "./types";

interface SideBarStore {
  links: LinkCard[]
  totalNumberValidatedLinks: number
  totalNumberBrokenLinks: number
  setLinks: (newLinks: LinkCard[]) => void
  setTotalNumberValidatedLinks: () => void
  setTotalNumberBrokenLinks: () => void
}

export const useStore = create<SideBarStore>((set) => ({
  totalNumberValidatedLinks: 0,
  totalNumberBrokenLinks: 0,
  links: [],
  setLinks: (newLinks) => set({links: newLinks}),
  setTotalNumberValidatedLinks: () => set((state) => (
    {totalNumberValidatedLinks: state.links.filter((links) => (links.validation_code !== undefined)).length})),
  setTotalNumberBrokenLinks: () => set((state) => (
    {totalNumberBrokenLinks: state.links.filter((links) => (links.validation_code !== undefined && links.validation_code !== 0)).length})),
}))