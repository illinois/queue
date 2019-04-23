import React from 'react'
import { Card, CardHeader, CardTitle, CardBody, Button } from 'reactstrap'

import { Link } from '../../routes'

const ThemePreviewPanel = () => {
  return (
    <Card className="mb-3">
      <CardHeader>
        <CardTitle tag="h5" className="mb-0">
          Theme preview
        </CardTitle>
      </CardHeader>
      <CardBody>
        <p>
          The Queue supports both light and dark themes. Admins can use the
          theme preview page to see a variety of Bootstrap components and how
          they look under each theme.
        </p>
        <Link passHref route="adminThemePreview">
          <Button tag="a" color="primary">
            Preview themes
          </Button>
        </Link>
      </CardBody>
    </Card>
  )
}

export default ThemePreviewPanel
