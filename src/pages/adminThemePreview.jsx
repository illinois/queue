import React from 'react'
import {
  Container,
  Alert,
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'
import PageWithUser from '../components/PageWithUser'

const colors = [
  'primary',
  'secondary',
  'success',
  'info',
  'warning',
  'danger',
  'dark',
  'light',
]

// eslint-disable-next-line react/prop-types
const Header = ({ children }) => <h1 className="mt-4">{children}</h1>

const AdminThemePreview = () => {
  return (
    <Container>
      <Header>Alerts</Header>
      {colors.map(color => (
        <Alert color={color} key={color} fade={false}>
          Here&apos;s a {color} alert. Neat, huh?
        </Alert>
      ))}
      <Header>Badges</Header>
      {colors.map(color => (
        <Badge color={color} key={color} className="mr-2 mb-2">
          {color}
        </Badge>
      ))}
      <Header>Buttons</Header>
      {colors.map(color => (
        <Button color={color} className="mr-3 mb-3" key={color}>
          {color}
        </Button>
      ))}
      <br />
      {colors.map(color => (
        <Button color={color} outline className="mr-3 mb-3" key={color}>
          {color}
        </Button>
      ))}
      <Header>Modals</Header>
      <div
        className="modal"
        style={{
          position: 'relative',
          top: 'auto',
          right: 'auto',
          bottom: 'auto',
          left: 'auto',
          zIndex: 1,
          display: 'block',
        }}
      >
        <div className="modal-content">
          <ModalHeader>Are you sure?</ModalHeader>
          <ModalBody>Do you really want to do that?</ModalBody>
          <ModalFooter>
            <Button color="danger">Yes</Button>
            <Button color="secondary">No</Button>
          </ModalFooter>
        </div>
      </div>
      <Header>Background utilities</Header>
      {colors.map(color => (
        <div className={`p-3 mb-3 bg-${color}`} key={color}>
          bg-{color}
        </div>
      ))}
    </Container>
  )
}

export default PageWithUser(AdminThemePreview, { requireAdmin: true })
