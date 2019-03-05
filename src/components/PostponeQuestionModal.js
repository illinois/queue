import React from 'react'
import PropTypes from 'prop-types'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  FormText,
  Label,
  Col,
  Input,
  ListGroup,
  ListGroupItem,
  Button,
} from 'reactstrap'
import { useInput } from 'react-hanger'

const MESSAGE_PRESETS = [
  'Not at the specified location',
  'Question topic is too vague',
  "Question doesn't meet the standards defined for this queue",
]

const PostponeQuestionModal = props => {
  const reasonInput = useInput('')
  const updateReasonFromItem = (event, preset) => {
    event.preventDefault()
    reasonInput.setValue(preset)
  }
  const onPostpone = () => {
    props.onPostpone(reasonInput.value)
  }
  return (
    <Modal isOpen={props.isOpen} toggle={props.toggle}>
      <ModalHeader>Postpone question</ModalHeader>
      <ModalBody>
        <p>
          Postponing a question will move it 10 spots down the queue. It will
          also show your reason to the student who asked the question, as well
          as other instructors.
        </p>
        <Form autoComplete={false}>
          <FormGroup row>
            <Label for="reason" sm={4}>
              Reason
            </Label>
            <Col sm={8}>
              <Input
                type="text"
                value={reasonInput.value}
                onChange={reasonInput.onChange}
              />
              <FormText color="muted">
                This will be shown to the student and other instructors.
              </FormText>
            </Col>
          </FormGroup>
        </Form>
        <span className="text-muted">
          You can also select from these preset reasons.
        </span>
        <ListGroup>
          {MESSAGE_PRESETS.map(preset => (
            <ListGroupItem
              tag="a"
              action
              role="button"
              href="#"
              onClick={e => updateReasonFromItem(e, preset)}
            >
              {preset}
            </ListGroupItem>
          ))}
        </ListGroup>
      </ModalBody>
      <ModalFooter>
        <Button color="danger" onClick={onPostpone}>
          Postpone
        </Button>
        <Button color="secondary" onClick={props.toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  )
}

PostponeQuestionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  onPostpone: PropTypes.func.isRequired,
}

export default PostponeQuestionModal
