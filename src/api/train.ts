import axios from 'axios'
import { JSDOM } from 'jsdom'

const getDocument = async url => {
  const { data } = await axios.get(url)
  const {
    window: { document }
  } = new JSDOM(data)
  return document
}

export const getKantoLineNames = async () => {
  const document = await getDocument(
    'https://transit.yahoo.co.jp/traininfo/area/4/'
  )

  const lines = document.querySelectorAll('.elmTblLstLine a')

  return Array.from(lines).map(lineElm => lineElm.innerHTML)
}
