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
  const renderMenu = (results, menuProps) => {
    // Hide the autocomplete when user is staff
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
  }

  useEffect(() => {
    if (!uidQuery) {
      return () => {}
    }
    const source = CancelToken.source()
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
        setUidInput(value)
      }}
      minLength={1}
      useCache={false}
      // Attempt to force Chrome to hide the native email autocomplete
      inputProps={{
        autoComplete: 'new-user-uid',
        ...inputProps,
      }}
      // renderMenu={renderMenu}
      renderMenu={renderMenu}
      {...restProps}
    />
  )
}

UserAutocomplete.propTypes = {
  user: PropTypes.shape({
    uid: PropTypes.string,
    userId: PropTypes.string,
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
