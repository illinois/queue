/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { Input, Button } from 'reactstrap'
import NewQuestion from './NewQuestion'

const makeProps = (queueId, userName) => ({
  queueId,
  user: {
    name: userName,
  },
  createQuestion: jest.fn(),
})

const doInputChange = (wrapper, name, value) => {
  wrapper.instance().handleInputChange({ target: { name, value } })
}

describe('<NewQuestion />', () => {
  test('defaults to empty name if user doesn\'t have one set', () => {
    const props = makeProps(1, null)
    const wrapper = shallow(<NewQuestion {...props} />)
    const nameInput = wrapper.find(Input).find('[name="name"]')
    expect(nameInput.prop('value')).toBe('')
  })

  test('populates the name field with the user\'s name', () => {
    const props = makeProps(1, 'My Cool Name')
    const wrapper = shallow(<NewQuestion {...props} />)
    const nameInput = wrapper.find(Input).find('[name="name"]')
    expect(nameInput.prop('value')).toBe('My Cool Name')
  })

  test('creates a question', () => {
    const props = makeProps(50)
    const wrapper = shallow(<NewQuestion {...props} />)
    doInputChange(wrapper, 'name', 'My Name')
    doInputChange(wrapper, 'location', 'Right here')
    doInputChange(wrapper, 'topic', 'MP1')
    const submitButton = wrapper.find(Button)
    submitButton.simulate('click')
    expect(props.createQuestion).toBeCalledWith(50, {
      name: 'My Name',
      location: 'Right here',
      topic: 'MP1',
    })
  })

  test('rejects question with missing name', () => {
    const props = makeProps(1)
    const wrapper = shallow(<NewQuestion {...props} />)
    doInputChange(wrapper, 'location', 'Right here')
    doInputChange(wrapper, 'topic', 'MP1')
    const submitButton = wrapper.find(Button)
    submitButton.simulate('click')
    expect(props.createQuestion).not.toBeCalled()
  })

  test('rejects question with missing location', () => {
    const props = makeProps(1)
    const wrapper = shallow(<NewQuestion {...props} />)
    doInputChange(wrapper, 'name', 'My Name')
    doInputChange(wrapper, 'topic', 'MP1')
    const submitButton = wrapper.find(Button)
    submitButton.simulate('click')
    expect(props.createQuestion).not.toBeCalled()
  })

  test('rejects question with missing topic', () => {
    const props = makeProps(1)
    const wrapper = shallow(<NewQuestion {...props} />)
    doInputChange(wrapper, 'name', 'My Name')
    doInputChange(wrapper, 'location', 'Right here')
    const submitButton = wrapper.find(Button)
    submitButton.simulate('click')
    expect(props.createQuestion).not.toBeCalled()
  })
})
