/* eslint-env browser */
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import useLocalStorage from '@illinois/react-use-local-storage'

import './darkmode.scss'

const ThemeContext = React.createContext()
const useTheme = () => React.useContext(ThemeContext)

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkmode', false)
  const [isDarkModeOverridden, setIsDarkModeOverridden] = useState(false)
  const [darkModeOverriddenValue, setDarkModeOverriddenValue] = useState(false)
  const useOverrideDarkModeEffect = value =>
    useEffect(() => {
      setIsDarkModeOverridden(true)
      setDarkModeOverriddenValue(value)
      return () => {
        setIsDarkModeOverridden(false)
      }
    })
  const toggle = () => {
    setIsDarkMode(!isDarkMode)
  }
  useEffect(() => {
    const darkMode =
      (!isDarkModeOverridden && isDarkMode) ||
      (isDarkModeOverridden && darkModeOverriddenValue)
    const { classList } = document.getElementsByTagName('body')[0]
    if (darkMode) {
      classList.add('darkmode')
    } else {
      classList.remove('darkmode')
    }
  }, [isDarkMode, isDarkModeOverridden, darkModeOverriddenValue])
  return (
    <>
      <ThemeContext.Provider
        value={{
          darkMode: isDarkMode,
          toggle,
          set: setIsDarkMode,
          useOverrideDarkModeEffect,
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
