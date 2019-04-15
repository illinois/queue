/* eslint-env browser */
import React, { useEffect } from 'react'
import useLocalStorage from '@illinois/react-use-local-storage'

import DarkModeStyles from './DarkModeStyles'

const ThemeContext = React.createContext()
const useTheme = () => React.useContext(ThemeContext)

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkmode', false)
  const toggle = () => {
    console.log('toggling themes!')
    setIsDarkMode(!isDarkMode)
  }
  useEffect(() => {
    const { classList } = document.getElementsByTagName('body')[0]
    if (isDarkMode) {
      classList.add('darkmode')
    } else {
      classList.remove('darkmode')
    }
  }, [isDarkMode])
  return (
    <>
      {isDarkMode && <DarkModeStyles />}
      <ThemeContext.Provider value={{ darkMode: isDarkMode, toggle }}>
        {children}
      </ThemeContext.Provider>
    </>
  )
}

export { useTheme, ThemeProvider }
