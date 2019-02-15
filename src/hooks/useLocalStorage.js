/* eslint-env browser */
import { useState, useEffect } from 'react'

const useLocalStorage = (key, initialValue) => {
  if (window.localStorage.getItem(key) === null) {
    window.localStorage.setItem(key, JSON.stringify(initialValue))
  }
  const localStorageValue = JSON.parse(window.localStorage.getItem(key))
  const [localState, updateLocalState] = useState(localStorageValue)
  const localStorageChanged = e => {
    if (e.key === key) {
      updateLocalState(JSON.parse(e.newValue))
    }
  }
  const setLocalState = value => {
    window.localStorage.setItem(key, JSON.stringify(value))
    updateLocalState(value)
  }
  useEffect(() => {
    window.addEventListener('storage', localStorageChanged)
    return () => {
      window.removeEventListener('storage', localStorageChanged)
    }
  })
  return [localState, setLocalState]
}

export default useLocalStorage
