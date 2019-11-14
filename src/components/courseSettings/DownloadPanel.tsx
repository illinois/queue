import React from 'react'
import PropTypes from 'prop-types'
import { Card, CardHeader, CardTitle, Table } from 'reactstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
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
          <FontAwesomeIcon icon={faDownload} className="mr-2" /> Downloads
        </CardTitle>
      </CardHeader>

      <Table hover class="table-responsive">
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
    </Card>
  )
}

DownloadPanel.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number,
  }).isRequired,
}

export default DownloadPanel
