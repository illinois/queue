/* eslint-env browser */
import { useState, useEffect } from 'react'

const useLocalStorage = (key, initialValue) => {
  if (window.localStorage.getItem(key) === null) {
    window.localStorage.setItem(key, JSON.stringify(initialValue))
  }
  const localStorageValue = JSON.parse(window.localStorage.getItem(key))
  const [state, updateState] = useState(localStorageValue)
  const localStorageChanged = e => {
    if (e.key === key) {
      updateState(JSON.parse(e.newValue))
    }
  }
  const setState = value => {
    window.localStorage.setItem(key, JSON.stringify(value))
    updateState(value)
  }
  useEffect(() => {
    window.addEventListener('storage', localStorageChanged)
    return () => {
      window.removeEventListener('storage', localStorageChanged)
    }
  })
  return [state, setState]
}

export default useLocalStorage
