/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import Question from './Question'

const NAME = 'Cinda Heeren'
const LOCATION = 'Vancouver'
const TOPIC = 'Canadian Bacon'
const ENQUEUE_TIME = '2018-04-01T05:17:00.000Z'
const ANSWERED_BY = {
  name: 'Wade',
  uid: 'waf@illinois.edu',
}
const ASKED_BY = {
  uid: 'cheeren@illinois.edu',
}

const makeProps = (props = {}) => {
  const noop = () => {}

  return {
    id: 1,
    name: props.name || NAME,
    location: props.location || LOCATION,
    topic: props.topic || TOPIC,
    beingAnswered: props.beingAnswered || false,
    enqueueTime: props.enqueueTime || ENQUEUE_TIME,
    answeredBy: props.answeredBy || { ...ANSWERED_BY },
    askedBy: props.askedBy || { ...ASKED_BY },
    isUserCourseStaff: props.isUserCourseStaff || false,
    isUserActiveStaffForQueue: props.isUserActiveStaffForQueue || false,
    isUserAnsweringQuestion: props.isUserAnsweringQuestion || false,
    isUserAnsweringOtherQuestion: props.isUserAnsweringOtherQuestion || false,
    didUserAskQuestion: props.didUserAskQuestion || false,
    cancelQuestion: props.cancelQuestion || noop,
    startQuestion: props.startQuestion || noop,
    editQuestion: props.editQuestion || noop,
    finishedAnswering: props.finishedAnswering || noop,
    deleteQuestion: props.deleteQuestion || noop,
  }
}

const makeWrapper = props => shallow(<Question {...makeProps(props)} />)

const findButton = (wrapper, text) => {
  return wrapper.find('Button').findWhere(x => x.text() === text)
}

const childrenText = wrapper =>
  wrapper
    .children()
    .map(x => x.text())
    .join('')

describe('<Question />', () => {
  test('renders name, topic, and location for everyone', () => {
    const wrapper = makeWrapper()
    const nameNode = wrapper.find('[title="Name"]')
    expect(nameNode).toHaveLength(1)
    expect(nameNode.text()).toBe(NAME)
    const topicNode = wrapper.find('ParrotText')
    expect(topicNode).toHaveLength(1)
    expect(topicNode.prop('text')).toBe(TOPIC)
    const locationNode = wrapper.find('[title="Location"]')
    expect(locationNode).toHaveLength(1)
    expect(locationNode.text()).toBe(LOCATION)
  })

  test('hides UID for standard user', () => {
    const wrapper = makeWrapper()
    expect(wrapper.find('[title="UID"]')).toHaveLength(0)
  })

  test('shows UID for course staff', () => {
    const wrapper = makeWrapper({ isUserCourseStaff: true })
    const uidNode = wrapper.find('[title="UID"]')
    expect(uidNode).toHaveLength(1)
    expect(uidNode.text()).toEqual(expect.stringContaining(ASKED_BY.uid))
  })

  test('hides "Start answering" button for standard user', () => {
    const wrapper = makeWrapper()
    expect(findButton(wrapper, 'Start Answering!')).toHaveLength(0)
  })

  test('hides "Start answering" button for non-active course staff', () => {
    const wrapper = makeWrapper()
    expect(findButton(wrapper, 'Start Answering!')).toHaveLength(0)
  })

  test('shows "Start answering" button for active queue staff', () => {
    const wrapper = makeWrapper({ isUserActiveStaffForQueue: true })
    expect(findButton(wrapper, 'Start Answering!')).toHaveLength(1)
  })

  test('hides "Edit" button for standard user', () => {
    const wrapper = makeWrapper()
    expect(findButton(wrapper, 'Edit')).toHaveLength(0)
  })

  test('hides "Edit" button for course staff', () => {
    const wrapper = makeWrapper({ isUserCourseStaff: true })
    expect(findButton(wrapper, 'Edit')).toHaveLength(0)
  })

  test('shows "Edit" button for user who asked question', () => {
    const wrapper = makeWrapper({ didUserAskQuestion: true })
    expect(findButton(wrapper, 'Edit')).toHaveLength(1)
  })

  test('hides "Delete" button for standard user', () => {
    const wrapper = makeWrapper()
    expect(findButton(wrapper, 'Delete')).toHaveLength(0)
  })

  test('shows "Delete" button for course staff', () => {
    const wrapper = makeWrapper({ isUserCourseStaff: true })
    expect(findButton(wrapper, 'Delete')).toHaveLength(1)
  })

  test('shows "Delete" button for user who asked question', () => {
    const wrapper = makeWrapper({ didUserAskQuestion: true })
    expect(findButton(wrapper, 'Delete')).toHaveLength(1)
  })

  test('hides "Finish Answering" and "Stop Answering" buttons for standard user', () => {
    const wrapper = makeWrapper({ beingAnswered: true })
    expect(findButton(wrapper, 'Finish Answering')).toHaveLength(0)
    expect(findButton(wrapper, 'Stop Answering')).toHaveLength(0)
  })

  test('shows "Cancel" button for course staff when being answered', () => {
    const wrapper = makeWrapper({
      beingAnswered: true,
      isUserCourseStaff: true,
    })
    expect(findButton(wrapper, 'Interrupt')).toHaveLength(1)
  })

  test('hides "Finish Answering" button for other course staff when being answered', () => {
    const wrapper = makeWrapper({
      beingAnswered: true,
      isUserCourseStaff: true,
    })
    expect(findButton(wrapper, 'Finish Answering')).toHaveLength(0)
  })

  test('shows "Finish Answering" and "Stop Answering" for course staff who is answering question', () => {
    const wrapper = makeWrapper({
      beingAnswered: true,
      isUserCourseStaff: true,
      isUserAnsweringQuestion: true,
    })
    expect(findButton(wrapper, 'Finish Answering')).toHaveLength(1)
    expect(findButton(wrapper, 'Stop Answering')).toHaveLength(1)
  })

  test('shows name of person answering question', () => {
    const wrapper = makeWrapper({ beingAnswered: true })
    expect(childrenText(wrapper.find('Badge'))).toEqual(
      expect.stringContaining(ANSWERED_BY.name)
    )
  })
})
