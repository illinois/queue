/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import QuestionPanel from './QuestionPanel'
import NewQuestion from './NewQuestion'
import ActiveQuestionPanel from './ActiveQuestionPanel'

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
  test('renders new question panel if user does not have active question', () => {
    const props = makeProps(1, 'Genna', -1, false)
    const wrapper = shallow(<QuestionPanel {...props} />)
    expect(wrapper.find(NewQuestion)).not.toBeNull()
  })

  test('renders active question panel if user has active question', () => {
    const props = makeProps(1, 'Genna', 1, false)
    const wrapper = shallow(<QuestionPanel {...props} />)
    expect(wrapper.find(ActiveQuestionPanel)).not.toBeNull()
  })
})
