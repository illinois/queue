/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import { Collapse, CardHeader } from 'reactstrap'
import QueueMessageViewer from './QueueMessageViewer'

const makeProps = (props = {}) => {
  const noop = () => {}
  return {
    collapsible: props.collapsible || false,
    onEdit: props.onEdit || noop,
    queueId: 1,
    message: props.message || '',
    editable: props.editable || false,
  }
}

const makeWrapper = props =>
  shallow(<QueueMessageViewer {...makeProps(props)} />)

describe('<QueueMessageViewer />', () => {
  it('shows the expanded message if not collapsible', () => {
    const wrapper = makeWrapper({ collapsible: false })
    const collapse = wrapper.find(Collapse)
    expect(collapse.prop('isOpen')).toBeTruthy()
  })

  it('shows edit button if editable', () => {
    const wrapper = makeWrapper({ editable: true })
    const button = wrapper.find('[aria-label="Edit message"]')
    expect(button).toHaveLength(1)
  })

  it('hides edit button if not editable', () => {
    const wrapper = makeWrapper({ editable: false })
    const button = wrapper.find('[aria-label="Edit message"]')
    expect(button).toHaveLength(0)
  })
})
