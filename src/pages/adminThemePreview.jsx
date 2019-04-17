import React from 'react'
import { Container, Alert, Badge, Button } from 'reactstrap'
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

const AdminThemePreview = () => {
  return (
    <Container>
      <h1>Alerts</h1>
      {colors.map(color => (
        <Alert color={color} key={color}>
          Here&apos;s a {color} alert. Neat, huh?
        </Alert>
      ))}
      <h1>Badges</h1>
      {colors.map(color => (
        <Badge color={color} key={color} className="mr-2 mb-2">
          {color}
        </Badge>
      ))}
      <h1>Buttons</h1>
      {colors.map(color => (
        <Button color={color} className="mr-3 mb-3" key={color}>
          {color}
        </Button>
      ))}
      <h1>Background utilities</h1>
      {colors.map(color => (
        <div className={`p-3 mb-3 bg-${color}`}>bg-{color}</div>
      ))}
    </Container>
  )
}

export default PageWithUser(AdminThemePreview, { requireAdmin: true })
