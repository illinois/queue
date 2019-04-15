/* eslint-env browser */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import useLocalStorage from '@illinois/react-use-local-storage'

import './darkmode.scss'

const ThemeContext = React.createContext()
const useTheme = () => React.useContext(ThemeContext)

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkmode', false)
  const [isDarkModeDisabed, setIsDarkModeDisabled] = useState(false)
  const useDisableDarkModeEffect = () =>
    useEffect(() => {
      setIsDarkModeDisabled(true)
      return () => {
        setIsDarkModeDisabled(false)
      }
    })
  const toggle = () => {
    setIsDarkMode(!isDarkMode)
  }
  useEffect(() => {
    const darkMode = isDarkMode && !isDarkModeDisabed
    const { classList } = document.getElementsByTagName('body')[0]
    if (darkMode) {
      classList.add('darkmode')
    } else {
      classList.remove('darkmode')
    }
  }, [isDarkMode, isDarkModeDisabed])
  return (
    <>
      <ThemeContext.Provider
        value={{
          darkMode: isDarkMode,
          toggle,
          set: setIsDarkMode,
          useDisableDarkModeEffect,
        }}
      >
        {children}
      </ThemeContext.Provider>
    </>
  )
}

ThemeProvider.propTypes = {
  children: PropTypes.node,
}

ThemeProvider.defaultProps = {
  children: null,
}

export { useTheme, ThemeProvider }
