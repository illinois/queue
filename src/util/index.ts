/* eslint-env browser */

declare global {
  interface Window {
    BASE_URL: string
    IS_DEV: boolean
  }
}

export const baseUrl: string =
  (typeof window !== 'undefined' && window.BASE_URL) ||
  (typeof process !== 'undefined' && process.env.BASE_URL) ||
  ''

export const isDev: boolean =
  (typeof window !== 'undefined' && window.IS_DEV) ||
  (typeof process !== 'undefined' &&
    ['production', 'staging'].indexOf(process.env.NODE_ENV as string) === -1)

export const withBaseUrl = (url: string) => `${module.exports.baseUrl}${url}`

interface ObjectWithIds<T> {
  [key: string]: T
}

export const mapObjectToArray = <T>(o: ObjectWithIds<T>): T[] => {
  const keys = Object.keys(o).map(id => Number.parseInt(id, 10))
  const sortKeys = keys.sort((a, b) => (a < b ? -1 : 1))
  return sortKeys.map(id => o[id])
}
