/* eslint-disable no-nested-ternary */
import React from 'react'
import ReactSelect from 'react-select'
import { useTheme } from './ThemeProvider'

const Select = props => {
  const { isDarkMode } = useTheme()

  const customStylesCommon = {
    menu: () => ({
      marginTop: 0,
    }),
    control: (provided, state) => ({
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : null,
      '&:hover': null,
    }),
    option: (provided, state) => ({
      cursor: 'pointer',
      backgroundColor: state.isSelected
        ? 'red'
        : state.isFocused
        ? 'blue'
        : 'transparent',
    }),
  }

  const customStylesLight = {
    menu: (provided, state) => ({
      ...provided,
      ...customStylesCommon.menu(),
    }),
    control: (provided, state) => ({
      ...provided,
      ...customStylesCommon.control(provided, state),
      backgroundColor: state.isDisabled ? '#e9ecef' : 'white',
      borderColor: '#ced4da',
    }),
    option: (provided, state) => ({
      ...provided,
      ...customStylesCommon.option(provided, state),
    }),
  }

  const customStylesDark = {
    menu: (provided, state) => ({
      ...provided,
      ...customStylesCommon.menu(),
      backgroundColor: '#222',
    }),
    control: (provided, state) => ({
      wig3: console.log(state.menuIsOpen),
      ...provided,
      ...customStylesCommon.control(provided, state),
      backgroundColor: 'rgba(255, 255, 255, 0.09)',
      borderColor: '#595959',
    }),
    option: (provided, state) => ({
      ...provided,
      ...customStylesCommon.option(provided, state),
      backgroundColor: state.isSelected
        ? '#2c7be5'
        : state.isFocused
        ? '#5997eb'
        : 'transparent',
      ':active': {
        backgroundColor: state.isSelected ? '#2c7be5' : '#4a8ee9',
      },
    }),
    singleValue: provided => ({
      ...provided,
      color: '#fff',
    }),
  }

  const theme = existingTheme => ({
    ...existingTheme,
    borderRadius: '0.25rem',
    colors: {
      ...existingTheme.colors,
      primary: isDarkMode ? '#2c7be5' : '#007bff',
      // neutral0: isDarkMode ? '#343a40' : existingTheme.colors.neutral0,
    },
  })

  const styles = isDarkMode ? customStylesDark : customStylesLight

  return <ReactSelect {...props} theme={theme} styles={styles} />
}

export default Select
