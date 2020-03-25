import React, { useState } from 'react'
import {
  Container,
  Alert,
  Badge,
  Button,
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  FormGroup,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from 'reactstrap'
import PageWithUser from '../components/PageWithUser'
import Select from '../components/Select'
import UserAutocomplete from '../components/UserAutocomplete'

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
  const selectOptions = [
    {
      value: 'thing',
      label: 'First thing',
    },
    {
      value: 'thing2',
      label: 'Second thing',
    },
  ]

  const [userAutocompleteSelected, setUserAutocompleteSelected] = useState(null)

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
        <Button disabled color={color} className="mr-3 mb-3" key={color}>
          {color}
        </Button>
      ))}
      <br />
      {colors.map(color => (
        <Button color={color} outline className="mr-3 mb-3" key={color}>
          {color}
        </Button>
      ))}
      <br />
      {colors.map(color => (
        <Button
          disabled
          color={color}
          outline
          className="mr-3 mb-3"
          key={color}
        >
          {color} - Disabled
        </Button>
      ))}
      <Header>Cards</Header>
      <Card>
        <CardBody>This is some card content.</CardBody>
      </Card>
      <Header>Tables</Header>
      <Table hover>
        <thead>
          <tr>
            <th>#</th>
            <th>First Name</th>
            <th>Last Name</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">1</th>
            <td>Mark</td>
            <td>Otto</td>
          </tr>
          <tr>
            <th scope="row">2</th>
            <td>Jacob</td>
            <td>Thornton</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>the Bird</td>
          </tr>
        </tbody>
      </Table>
      <Header>Dropdowns</Header>
      <UncontrolledDropdown>
        <DropdownToggle caret>Dropdown</DropdownToggle>
        <DropdownMenu>
          <DropdownItem header>Header</DropdownItem>
          <DropdownItem disabled>Action</DropdownItem>
          <DropdownItem>Another Action</DropdownItem>
          <DropdownItem divider />
          <DropdownItem>Another Action</DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>
      <Header>Forms</Header>
      <FormGroup>
        <Input />
      </FormGroup>
      <FormGroup>
        <InputGroup>
          <InputGroupAddon addonType="prepend">
            <InputGroupText>$</InputGroupText>
            <InputGroupText>$</InputGroupText>
          </InputGroupAddon>
          <Input placeholder="Dolla dolla billz yo!" />
          <InputGroupAddon addonType="append">
            <Button color="primary">Swag</Button>
          </InputGroupAddon>
        </InputGroup>
      </FormGroup>
      <FormGroup>
        <Input disabled placeholder="Disabled input" />
      </FormGroup>
      <FormGroup>
        <Select options={selectOptions} />
      </FormGroup>
      <FormGroup>
        <Select options={selectOptions} isDisabled />
      </FormGroup>
      <FormGroup>
        <UserAutocomplete
          id="admin-search"
          selected={userAutocompleteSelected}
          onChange={user => setUserAutocompleteSelected[user]}
        />
      </FormGroup>
      <Card>
        <CardBody>
          <FormGroup>
            <Input />
          </FormGroup>
          <FormGroup>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>$</InputGroupText>
                <InputGroupText>$</InputGroupText>
              </InputGroupAddon>
              <Input placeholder="Dolla dolla billz yo!" />
              <InputGroupAddon addonType="append">
                <Button color="primary">Swag</Button>
              </InputGroupAddon>
            </InputGroup>
          </FormGroup>
          <FormGroup>
            <Input disabled placeholder="Disabled input" />
          </FormGroup>
          <FormGroup>
            <Select options={selectOptions} />
          </FormGroup>
          <FormGroup>
            <Select options={selectOptions} isDisabled />
          </FormGroup>
          <FormGroup>
            <UserAutocomplete
              id="admin-search-card"
              selected={userAutocompleteSelected}
              onChange={user => setUserAutocompleteSelected[user]}
            />
          </FormGroup>
        </CardBody>
      </Card>
      <Header>Modals</Header>
      <div
        className="modal"
        style={{
          position: 'relative',
          top: 'auto',
          right: 'auto',
          bottom: 'auto',
          left: 'auto',
          zIndex: 0,
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
