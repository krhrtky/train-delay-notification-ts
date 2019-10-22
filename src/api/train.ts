import { getDocument } from '../lib/getDocument'

export const getKantoLineNames = async () => {
  const document = await getDocument(
    'https://transit.yahoo.co.jp/traininfo/area/4/'
  )

  const lines = document.querySelectorAll('.elmTblLstLine a')

  return Array.from(lines).map(lineElm => (lineElm as Element).innerHTML)
}

export const getDelays = async () => {
  const document = await getDocument(
    'https://transit.yahoo.co.jp/traininfo/area/4/'
  )
  const delays = document.querySelectorAll('.elmTblLstLine.trouble table a')

  return delays.length === 0
    ? []
    : await Promise.all(
        Array.from(delays).map(async delayAnchor => {
          const document = await getDocument(
            (delayAnchor as HTMLAnchorElement).href
          )
          const line = document.querySelectorAll('.title')[0].innerHTML
          const description = document
            .querySelectorAll('#main .trouble p')[0]
            .innerHTML.replace(/<\/?span>/g, '')
          return {
            name: line,
            description
          }
        })
      )
}
