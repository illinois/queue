/* eslint-env browser */
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import useLocalStorage from '@illinois/react-use-local-storage'

import './darkmode.scss'

const ThemeContext = React.createContext()
const useTheme = () => React.useContext(ThemeContext)

const ThemeProvider = ({ children, isDarkMode: isDarkModeInitial }) => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage(
    'darkmode',
    isDarkModeInitial
  )
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }
  useEffect(() => {
    const { classList } = document.getElementsByTagName('body')[0]
    if (isDarkMode) {
      classList.add('darkmode')
    } else {
      classList.remove('darkmode')
    }
    // Save as a cookie so we can correctly SSR with dark styles
    document.cookie = `darkmode=${isDarkMode};path=/`
  }, [isDarkMode])
  return (
    <>
      <ThemeContext.Provider
        value={{
          isDarkMode,
          toggleDarkMode,
          setIsDarkMode,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
  isDarkMode: PropTypes.bool,
}

ThemeProvider.defaultProps = {
  children: null,
  isDarkMode: false,
}

export { useTheme, ThemeProvider }
