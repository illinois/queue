/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { Input } from 'reactstrap'
import NewQuestion from './NewQuestion'

const makeProps = (queueId, userName = null) => ({
  queueId,
  user: {
    name: userName,
  },
  createQuestion: jest.fn().mockReturnValueOnce({
    // Fake Promie, woooo
    then: () => {},
  }),
  isUserCourseStaff: false,
})

describe('<NewQuestion />', () => {
  test("defaults to empty name if user doesn't have one set", () => {
    const props = makeProps(1)
    const wrapper = shallow(<NewQuestion {...props} />)
    const nameInput = wrapper.find(Input).find('[id="student-name"]')
    expect(nameInput.prop('value')).toBe('')
  })

  test("populates the name field with the user's name", () => {
    const props = makeProps(1, 'My Cool Name')
    const wrapper = shallow(<NewQuestion {...props} />)
    const nameInput = wrapper.find(Input).find('[id="student-name"]')
    expect(nameInput.prop('value')).toBe('My Cool Name')
  })

  test("shows queue's location for fixed-location queue", () => {
    const props = makeProps(1)
    props.queue = { location: 'My Queue Location', fixedLocation: true }
    const wrapper = shallow(<NewQuestion {...props} />)
    const locationInput = wrapper.find(Input).find('[name="location"]')
    expect(locationInput.prop('value')).toBe('My Queue Location')
  })

  test('disables location field for fixed-location queue', () => {
    const props = makeProps(1)
    props.queue = { fixedLocation: true }
    const wrapper = shallow(<NewQuestion {...props} />)
    const locationInput = wrapper.find(Input).find('[name="location"]')
    expect(locationInput.prop('disabled')).toBe(true)
  })
})
