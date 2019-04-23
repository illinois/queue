/* eslint-disable no-nested-ternary */
import React from 'react'
import PropTypes from 'prop-types'
import ReactSelect from 'react-select'

import { useTheme } from './ThemeProvider'

const Select = props => {
  const { isDarkMode } = useTheme()

  const customStylesCommon = {
    menu: () => ({
      marginTop: '2px',
    }),
    control: (provided, state) => ({
      boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : null,
      transition: 'border-color .15s ease-in-out, box-shadow .15s ease-in-out',
      '&:hover': null,
    }),
    option: () => ({
      cursor: 'pointer',
    }),
    menuList: () => ({
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
    }),
  }

  const customStylesLight = {
    menu: provided => ({
      ...provided,
      ...customStylesCommon.menu(),
    }),
    control: (provided, state) => ({
      ...provided,
      ...customStylesCommon.control(provided, state),
      backgroundColor: state.isDisabled ? '#e9ecef' : 'white',
      borderColor: props.invalid ? '#dc3545' : '#ced4da',
    }),
    option: (provided, state) => ({
      ...provided,
      ...customStylesCommon.option(provided, state),
    }),
    menuList: provided => ({
      ...provided,
      ...customStylesCommon.menuList(),
    }),
  }

  const customStylesDark = {
    menu: provided => ({
      ...provided,
      ...customStylesCommon.menu(),
      backgroundColor: '#464c50',
    }),
    control: (provided, state) => ({
      ...provided,
      ...customStylesCommon.control(provided, state),
      backgroundColor: '#464c50',
      borderColor: props.invalid ? '#e63757' : '#595959',
    }),
    option: (provided, state) => ({
      ...provided,
      ...customStylesCommon.option(provided, state),
      color: 'white',
    }),
    singleValue: provided => ({
      ...provided,
      color: '#fff',
    }),
    menuList: provided => ({
      ...provided,
      ...customStylesCommon.menuList(),
    }),
    placeholder: provided => ({
      ...provided,
      color: '#939ca9',
    }),
  }

  const themeColorsDark = {
    primary: '#2c7be5',
    primary25: '#5997eb',
    primary50: '#4a8ee9',
    primary75: '',
    neutral90: 'hsl(0, 0%, 100%)',
    neutral80: 'hsl(0, 0%, 95%)',
    neutral70: 'hsl(0, 0%, 90%)',
    neutral60: 'hsl(0, 0%, 80%)',
    neutral50: 'hsl(0, 0%, 70%)',
    neutral40: 'hsl(0, 0%, 60%)',
    neutral30: 'hsl(0, 0%, 50%)',
    neutral20: 'hsl(0, 0%, 40%)',
    neutral10: 'hsl(0, 0%, 30%)',
    neutral5: 'hsl(0, 0%, 20%)',
    neutral0: 'hsl(0, 0%, 10%)',
  }

  const themeColorsLight = {
    primary: '#007bff',
  }

  const themeColors = isDarkMode ? themeColorsDark : themeColorsLight

  const theme = existingTheme => ({
    ...existingTheme,
    borderRadius: '0.25rem',
    colors: {
      ...existingTheme.colors,
      ...themeColors,
    },
  })

  const styles = isDarkMode ? customStylesDark : customStylesLight

  return <ReactSelect {...props} theme={theme} styles={styles} />
}

Select.propTypes = {
  invalid: PropTypes.bool,
}

Select.defaultProps = {
  invalid: false,
}

export default Select
