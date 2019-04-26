import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Form,
  FormText,
  InputGroup,
  Input,
  InputGroupAddon,
  Button,
} from 'reactstrap'
import { useInput } from 'react-hanger'
import { connect } from 'react-redux'
import getConfig from 'next/config'

import { updateUserPreferredName as updateUserPreferredNameAction } from '../../actions/user'

const { uidName } = getConfig().publicRuntimeConfig

const UserProfilePanel = ({ user, updateUserPreferredName }) => {
  const preferredNameInput = useInput(user.preferredName || '')
  const changed = preferredNameInput.value !== user.preferredName

  const onSubmit = e => {
    e.preventDefault()
    updateUserPreferredName(preferredNameInput.value)
  }

  return (
    <Card className="mb-3">
      <CardHeader>
        <CardTitle tag="h5" className="mb-0">
          Profile
        </CardTitle>
      </CardHeader>
      <CardBody>
        <div className="mb-3">
          <div className="text-muted small">{uidName}</div>
          <div>{user.uid}</div>
        </div>
        <div className="mb-3">
          <div className="text-muted small">University Name</div>
          <div>{user.universityName || 'No name :('}</div>
        </div>
        <div>
          <div className="text-muted small">Preferred Name</div>
          <Form
            autoComplete="off"
            className="d-flex align-items-center mt-2"
            style={{ flexWrap: 'nowrap' }}
            onSubmit={onSubmit}
          >
            <InputGroup>
              <Input
                type="text"
                name="name"
                placeholder="Enter your preferred name"
                {...preferredNameInput.bindToInput}
              />
              <InputGroupAddon addonType="append">
                <Button color="primary" type="submit" disabled={!changed}>
                  Update
                </Button>
              </InputGroupAddon>
            </InputGroup>
          </Form>
          <FormText color="muted">
            If you go by a different name than that in the school&apos;s records
            or have a preferred nickname, you can enter that here. This will be
            used to pre-fill your name when you&apos;re adding a new question.
          </FormText>
        </div>
      </CardBody>
    </Card>
  )
}

UserProfilePanel.propTypes = {
  user: PropTypes.shape({
    universityName: PropTypes.string,
    preferredName: PropTypes.string,
  }).isRequired,
  updateUserPreferredName: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  user: state.user.user,
})

const mapDispatchToProps = dispatch => ({
  updateUserPreferredName: name =>
    dispatch(updateUserPreferredNameAction(name)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfilePanel)
