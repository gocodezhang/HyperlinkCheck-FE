// import { findSentencesWithLinkIndex } from "./searchContext";
// import { validateLinks } from "./apiCalls";

export function onOpen(e: GoogleAppsScript.Events.DocsOnOpen) {
  DocumentApp.getUi().createAddonMenu()
      .addItem('Start', 'showSidebar')
      .addToUi();
}

export function showSidebar() {
  const sideBar = HtmlService.createHtmlOutputFromFile('client/dist/index')
  DocumentApp.getUi().showSidebar(sideBar)
}
