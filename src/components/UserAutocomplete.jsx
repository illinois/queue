import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import { useInput } from 'react-hanger'
import { useDebounce } from 'use-debounce'
import { CancelToken } from 'axios'
import {
  AsyncTypeahead,
  Menu,
  MenuItem,
  Highlighter,
} from 'react-bootstrap-typeahead'

import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css'

import axios from '../actions/axios'

const UserAutocomplete = props => {
  const { user } = props
  const { setUidInput } = props
  const uidInput = useInput('')
  const [uidQuery] = useDebounce(uidInput.value, 300)
  const [userSuggestions, setUserSuggestions] = useState([])
  const [userSuggestionsLoading, setUserSuggestionsLoading] = useState(false)
  const renderMenu = (results, menuProps, _props) => {
    console.log('results', results)
    console.log('menuProps', menuProps)
    console.log('props', _props)
    const menuItems = results.map((result, idx) => {
      console.log('result', result)
      console.log('idx', idx)
      return null
    })
    return null
  }

  useEffect(() => {
    if (!uidQuery) {
      return () => {}
    }
    const source = CancelToken.source()
    console.log('user', user)
    if (user.isAdmin) {
      setUserSuggestionsLoading(true)
      axios
        .get('/api/autocomplete/users', {
          params: {
            q: uidQuery,
          },
          cancelToken: source.token,
        })
        .then(res => {
          ReactDOM.unstable_batchedUpdates(() => {
            // The typeahead component will filter out existing admins
            setUserSuggestions(res.data)
            setUserSuggestionsLoading(false)
          })
        })
        .catch(err => {
          console.error(err)
        })
    }
    return () => {
      source.cancel()
    }
  }, [uidQuery])

  const { inputProps, ...restProps } = props

  return (
    <AsyncTypeahead
      isLoading={userSuggestionsLoading}
      options={userSuggestions}
      onSearch={() => {
        /* This is handled by hooks, but prop must be specified */
      }}
      labelKey="uid"
      onInputChange={value => {
        uidInput.setValue(value)
        // setPendingUser([{ uid: value }])
        setUidInput(value)
        console.log('uidInput and setPendingUser u.uid', uidInput)
      }}
      minLength={1}
      useCache={false}
      // Attempt to force Chrome to hide the native email autocomplete
      inputProps={{
        autoComplete: 'new-user-uid',
        ...inputProps,
      }}
      // renderMenu={renderMenu}
      renderMenu={(results, menuProps, props) => {
        // Hide the autocomplete when user is not admin
        if (!user.isAdmin) {
          return <></>
        }
        const items = results.map((result, idx) => (
          <MenuItem
            key={result.id}
            option={result}
            position={idx}
            className="GlobalSearchTypeahead__option"
          >
            <Highlighter search={menuProps.text}>{result.uid}</Highlighter>
            {result.name && (
              <span className="text-muted ml-2">({result.name})</span>
            )}
          </MenuItem>
        ))
        return <Menu {...menuProps}>{items}</Menu>
      }}
      {...restProps}
    />
  )
}

UserAutocomplete.propTypes = {
  user: PropTypes.shape({
    universityName: PropTypes.string,
    preferredName: PropTypes.string,
  }).isRequired,
  selected: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string,
    })
  ),
  setUidInput: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  // We don't know exactly what these props will be
  // eslint-disable-next-line react/forbid-prop-types
  inputProps: PropTypes.object,
}

UserAutocomplete.defaultProps = {
  selected: null,
  inputProps: {},
}

const mapStateToProps = state => ({
  user: state.user.user,
})

export default connect(mapStateToProps)(UserAutocomplete)
