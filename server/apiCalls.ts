import { Link } from './searchContext'

export function validateLinks(links: Link[]) {
  const url = 'http://3.21.75.122:8000'
  const route = 'verify'

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(links)
  } as GoogleAppsScript.URL_Fetch.URLFetchRequestOptions

  const response = UrlFetchApp.fetch(`${url}/${route}`, options)
  return response.getContentText()
}
