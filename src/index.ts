import { docs_v1 } from "@googleapis/docs"

function main() {

  try {
    // need to undocument below two lines when upload to AppScript !!!!!!!!!!!!!!!!!!!!
    // const document = DocumentApp.getActiveDocument()
    // const docusId = document.getId()

    // need to update this when upload to AppScript !!!!!!!!!!!!!!!!!!!!
    // const docs = Docs.Documents.get(docsId)
    const docs = {} as docs_v1.Schema$Document

    const content = docs?.body?.content || []
    const paragraphs = findAllParagraphs(content)
    const links = findLinksInParagraphs(paragraphs)
    console.log(links)
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
  const links = []
  for (const paragraph of paragraphs) {
    const elements = paragraph.elements || []
    for (let i = 0; i < elements.length; i++) {
      const currTextRun = elements[i].textRun
      if (currTextRun && currTextRun.textStyle?.link?.url) {
        const passage_context = {linked_str: currTextRun.content, sentence: findSentenceWithLinkIndex(elements, i)}
        links.push({hyperlink: currTextRun.textStyle?.link?.url, passage_context: passage_context})
      }
    }
  }
  return links
}

function findSentenceWithLinkIndex(elements: docs_v1.Schema$ParagraphElement[], linkIndex: number) {
  const length = elements.length
  if (!length) {
    return ''
  }

  let afterStr = ''
  for (let i = linkIndex + 1; i < length; i++) {
    const afterCurrElement = elements[i]
    if (!afterCurrElement.textRun || !afterCurrElement.textRun.content) {
      break
    }
    const index = afterCurrElement.textRun.content.search(/\n|\./)
    if (index !== -1) {
      afterStr += afterCurrElement.textRun.content.substring(0, index)
      break
    }
    afterStr += afterCurrElement.textRun.content
  }

  let beforeStr = ''
  for (let i = linkIndex - 1; i >= 0; i--) {
    const beforeCurrElement = elements[i]
    if (!beforeCurrElement.textRun || !beforeCurrElement.textRun.content) {
      break
    }
    const maxIndex = Math.max(beforeCurrElement.textRun.content.lastIndexOf('\n'), beforeCurrElement.textRun.content.lastIndexOf('.'))
    if (maxIndex !== -1) {
      beforeStr += beforeCurrElement.textRun.content.substring(maxIndex + 1)
      break
    }
    beforeStr += beforeCurrElement.textRun.content
  }

  if (!beforeStr && !afterStr) {
    return ''
  }

  if (beforeStr) {
    beforeStr = beforeStr.trimStart() + ' ' 
  }
  if (afterStr) {
    afterStr = ' ' + afterStr.trimEnd()
  }

  return beforeStr + elements[linkIndex].textRun?.content + afterStr
}