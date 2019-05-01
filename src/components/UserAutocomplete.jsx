import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import { useInput } from 'react-hanger'
import { useDebounce } from 'use-debounce'
import { CancelToken } from 'axios'
import { AsyncTypeahead, Highlighter } from 'react-bootstrap-typeahead'

import 'react-bootstrap-typeahead/css/Typeahead.css'
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css'

import axios from '../actions/axios'

const UserAutocomplete = props => {
  const uidInput = useInput('')
  const [uidQuery] = useDebounce(uidInput.value, 300)
  const [userSuggestions, setUserSuggestions] = useState([])
  const [userSuggestionsLoading, setUserSuggestionsLoading] = useState(false)

  useEffect(() => {
    if (!uidQuery) {
      return () => {}
    }
    const source = CancelToken.source()
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
      onInputChange={value => uidInput.setValue(value)}
      minLength={1}
      useCache={false}
      // Attempt to force Chrome to hide the native email autocomplete
      inputProps={{
        autoComplete: 'new-user-uid',
        ...inputProps,
      }}
      renderMenuItemChildren={(option, typeaheadProps) => {
        return (
          <>
            <Highlighter search={typeaheadProps.text}>{option.uid}</Highlighter>
            {option.name && (
              <span className="text-muted ml-2">({option.name})</span>
            )}
          </>
        )
      }}
      {...restProps}
    />
  )
}

UserAutocomplete.propTypes = {
  selected: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string,
    })
  ),
  onChange: PropTypes.func.isRequired,
  // We don't know exactly what these props will be
  // eslint-disable-next-line react/forbid-prop-types
  inputProps: PropTypes.object,
}

UserAutocomplete.defaultProps = {
  selected: null,
  inputProps: {},
}

export default UserAutocomplete
