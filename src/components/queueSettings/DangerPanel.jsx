import React from 'react'
import PropTypes from 'prop-types'
import {
  Card,
  CardHeader,
  CardTitle,
  Button,
  ListGroup,
  ListGroupItem,
} from 'reactstrap'
import { useBoolean } from 'react-hanger'
import ConfirmDeleteQueueModal from '../ConfirmDeleteQueueModel'

const DangerPanel = props => {
  const showConfirmModal = useBoolean(false)
  return (
    <>
      <Card className="border border-danger">
        <CardHeader className="bg-danger text-white">
          <CardTitle tag="h5" className="mb-0">
            Danger zone
          </CardTitle>
          <small>Here be dragons</small>
        </CardHeader>
        <ListGroup>
          <ListGroupItem className="d-flex align-items-sm-center flex-column flex-sm-row">
            <div className="mr-auto pr-3">
              <strong>Delete this queue</strong>
              <p className="mb-0">
                Deleting a queue is permanent; please be sure you want to do
                this.
              </p>
            </div>
            <Button
              outline
              color="danger"
              className="mt-3 mt-sm-0"
              onClick={showConfirmModal.setTrue}
            >
              Delete&nbsp;queue
            </Button>
          </ListGroupItem>
        </ListGroup>
      </Card>
      <ConfirmDeleteQueueModal
        toggle={showConfirmModal.toggle}
        isOpen={showConfirmModal.value}
        confirm={() => props.deleteQueue()}
      />
    </>
  )
}

DangerPanel.propTypes = {
  deleteQueue: PropTypes.func.isRequired,
}

export default DangerPanel
