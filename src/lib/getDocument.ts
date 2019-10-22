import axios from 'axios'
import { JSDOM } from 'jsdom'
// import { mockCanvas } from './mockCanvas'

export const getDocument = async url => {
  const { data } = await axios.get(url)
  const {
    window: { document }
  } = new JSDOM(data)
  // } = mockCanvas(new JSDOM(data))
  return document
}
