import { Link } from './searchContext'

interface ValidationResult {
  keywords: string[]
  scores: number[]
  validation_code: number
}

export function validateLinks(links: Link[]): ValidationResult[] {
  const url = 'http://18.188.232.56:8000'
  const route = 'verify'

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(links)
  } as GoogleAppsScript.URL_Fetch.URLFetchRequestOptions

  const response = UrlFetchApp.fetch(`${url}/${route}`, options)

  // get text and parse into array
  return JSON.parse(response.getContentText())
}
