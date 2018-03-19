/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import QuestionPanel from './QuestionPanel'

const makeProps = (
  queueId,
  userName,
  userActiveQuestionId,
  isUserActiveStaff
) => ({
  queueId,
  user: {
    name: userName,
  },
  userActiveQuestionId,
  isUserActiveStaff,
})

describe('<QuestionPanel />', () => {
  test("doesn't render question panel if user is active staff", () => {
    const props = makeProps(1, 'Genna', 1, true)
    const wrapper = shallow(<QuestionPanel {...props} />)
    expect(wrapper.get(0)).toBeNull()
  })

  test('renders question panel if user is not active staff', () => {
    const props = makeProps(1, 'Genna', 1, false)
    const wrapper = shallow(<QuestionPanel {...props} />)
    expect(wrapper.get(0)).not.toBeNull()
  })
})
