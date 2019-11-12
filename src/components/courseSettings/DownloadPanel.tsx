import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardHeader, CardTitle, CardBody, Table } from 'reactstrap'
import { withBaseUrl } from '../../util'

interface DownloadPanelProps {
  course: {
    id: number
  }
}

const DownloadPanel = ({ course }: DownloadPanelProps) => {
  return (
    <Card className="mb-3">
      <CardHeader>
        <CardTitle tag="h5" className="mb-0">
          Downloads
        </CardTitle>
      </CardHeader>
      <CardBody>
        <Table hover>
          <thead>
            <tr>
              <th />
              <th>Data File</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row" />
              <td>
                <a
                  href={withBaseUrl(`/api/courses/${course.id}/data/questions`)}
                  download
                >
                  courseData.csv
                </a>
              </td>
              <td>
                Detailed data for each question answered on all the queues owned
                by this course.
              </td>
            </tr>
          </tbody>
        </Table>
      </CardBody>
    </Card>
  )
}

DownloadPanel.propTypes = {
  course: PropTypes.shape({
    name: PropTypes.string,
    shortcode: PropTypes.string,
    isUnlisted: PropTypes.bool,
    questionFeedback: PropTypes.bool,
  }).isRequired,
}

export default DownloadPanel
