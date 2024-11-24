import { docs_v1 } from "@googleapis/docs"

export interface PassageContext {
  linked_str: string
  sentence: string
  three_sentences?: string
}

export interface Link {
  hyperlink: string,
  passage_context: PassageContext
}

export function findHyperLinks() {

  try {
    const document = DocumentApp.getActiveDocument()
    const docsId = document.getId()

    const docs = Docs.Documents?.get(docsId) as docs_v1.Schema$Document

    const content = docs?.body?.content || []
    const paragraphs = findAllParagraphs(content)
    const links = findLinksInParagraphs(paragraphs) as Link[]
    console.log(links)

    return links
    // make validate api call with 5 links every time 
    // let index = 0;
    // while (index < links.length) {
    //   const validatedResult = validateLinks(links.slice(index, index + 5));
    //   console.log(validatedResult)
    //   index += 5
    // }
  } catch (err) {
    console.log(err)
  }
}

function findAllParagraphs(content: docs_v1.Schema$StructuralElement[]) {
  const paragraphs: docs_v1.Schema$Paragraph[] = []
  for (const structualElement of content) {
    // find all paragraphs
    findParagraphHelper(structualElement, paragraphs)
  }
  return paragraphs
}

function findParagraphHelper(element: docs_v1.Schema$StructuralElement, result: docs_v1.Schema$Paragraph[]) {
  // base case 
  // this element is paragraph - add into result and return
  if (element.paragraph) {
    result.push(element.paragraph)
    return
  }
  // this element is section break - terminate as section break will not contain any paragraphs
  if (element.sectionBreak) {
    return
  }

  // resursive case
  // this element is table of contents - call its elements resursively
  if (element.tableOfContents) {
    for (const elementInTOC of element.tableOfContents.content || []) {
      findParagraphHelper(elementInTOC, result)
    }
  } else {
    // else this element is table - go into table cell and call its elements resurisvely
    const table = element.table as docs_v1.Schema$Table
    for (const tableRow of table.tableRows || []) {
      for (const tableCell of tableRow.tableCells || []) {
        for (const elementInCell of tableCell.content || []) {
          findParagraphHelper(elementInCell, result)
        }
      }
    }
  }
}

function findLinksInParagraphs(paragraphs: docs_v1.Schema$Paragraph[]) {
  const links: Link[] = []
  for (const paragraph of paragraphs) {
    const elements = paragraph.elements || []
    for (let i = 0; i < elements.length; i++) {
      const currTextRun = elements[i].textRun
      if (currTextRun && currTextRun.textStyle?.link?.url) {
        const passage_context = {linked_str: currTextRun.content as string, sentence: findSentencesWithLinkIndex(elements, i, currTextRun.content === 'here' ? 2 : 1)}
        links.push({hyperlink: currTextRun.textStyle?.link?.url, passage_context: passage_context})
      }
    }
  }
  return links
}




// Refactor
// 1. bugs on find sentences
// 2. how to better find the relevant context given hyperlink? sometime we need the prev sentence or prev paragraph
const sentenceBreakSymbolsSet = new Set(['.', '\n', '!', '?'])

export function findSentencesWithLinkIndex(elements: docs_v1.Schema$ParagraphElement[], linkIndex: number, numberOfSentences: number) {
  const length = elements.length
  if (!length) {
    return ''
  }

  let beforeSentencesRemaining = Math.ceil((numberOfSentences - 1) / 2) + 1
  let beforeStr = ''
  for (let i = linkIndex - 1; i >= 0; i--) {
    const beforeCurrElement = elements[i]
    if (!beforeCurrElement.textRun || !beforeCurrElement.textRun.content || beforeSentencesRemaining <= 0) {
      break
    }
    const { updatedSentencesRemaining, updatedStr } = searchSentencesInElementBackward(beforeCurrElement.textRun.content, beforeSentencesRemaining)

    beforeSentencesRemaining = updatedSentencesRemaining
    beforeStr = updatedStr + beforeStr
  }

  let afterSentencesRemaining = Math.floor((numberOfSentences - 1) / 2) + 1
  let afterStr = ''
  for (let i = linkIndex + 1; i < length; i++) {
    const afterCurrElement = elements[i]
    if (!afterCurrElement.textRun || !afterCurrElement.textRun.content || afterSentencesRemaining <= 0) {
      break
    }
    const { updatedSentencesRemaining, updatedStr} = searchSentencesInElement(afterCurrElement.textRun.content, afterSentencesRemaining)

    afterSentencesRemaining = updatedSentencesRemaining
    afterStr = afterStr + updatedStr
  }

  if (!beforeStr && !afterStr) {
    return ''
  }

  if (beforeStr) {
    beforeStr = beforeStr.trim() + ' ' 
  }
  if (afterStr) {
    afterStr = ' ' + afterStr.trim()
  }

  return beforeStr + elements[linkIndex].textRun?.content + afterStr
}

function searchSentencesInElement(str: string, quota: number) {
  const strlen = str.length

  let i = 0
  while (quota > 0 && i < strlen) {
    if (sentenceBreakSymbolsSet.has(str.charAt(i))) {
      quota -= 1
    }
    i++
  }

  return {updatedSentencesRemaining: quota, updatedStr: str.substring(0, i)}
}

function searchSentencesInElementBackward(str: string, quota: number) {
  const strlen = str.length

  let i = strlen - 1
  while (quota > 0 && i >= 0) {
    if (sentenceBreakSymbolsSet.has(str.charAt(i))) {
      quota -= 1
    }
    i--
  }

  return {updatedSentencesRemaining: quota, updatedStr: str.substring(i + 1, strlen)}
}