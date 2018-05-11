/* eslint-env browser */

import * as React from 'react'

function shouldTransition(oldChildren, newChildren) {
  if (oldChildren === newChildren) return false
  if (
    React.isValidElement(oldChildren) &&
    React.isValidElement(newChildren) &&
    oldChildren.key != null &&
    oldChildren.key === newChildren.key
  ) {
    return false
  }
  return true
}

export default class Fader extends React.Component {
  static defaultProps = {
    enterDuration: 200,
    exitDuration: 200,
    style: {},
  }

  constructor(props) {
    super(props)

    this.state = {
      children: null,
      renderedChildren: null,
      transitionState: 'out',
    }

    this.timeouts = {}
  }

  componentDidMount() {
    this.setState({
      children: this.props.children,
    })
  }

  componentDidUpdate() {
    const { transitionState, children: renderedChildren } = this.state
    const { children } = this.props
    const needsTransition = shouldTransition(renderedChildren, children)

    if (transitionState === 'in' && needsTransition) {
      const newState = {}
      newState.children = this.props.children
      newState.transitionState = 'exit'
      newState.renderedChildren = this.state.children

      this.setState(newState)
    } else if (transitionState === 'exit') {
      this.setTimeout('exit', this.onTransitionEnd, this.props.exitDuration)
      this.setState({
        transitionState: 'exit-active',
      })
    } else if (transitionState === 'out') {
      const newState = {}
      if (needsTransition) {
        newState.children = this.props.children
        newState.renderedChildren = this.props.children
      } else {
        newState.transitionState = 'appear'
        newState.children = this.props.children
        newState.renderedChildren = this.props.children
      }
      this.setState(newState)
    } else if (transitionState === 'appear') {
      this.setTimeout('enter', this.onTransitionEnd, this.props.enterDuration)
      this.setState({
        transitionState: 'appear-active',
      })
    } else if (
      !needsTransition &&
      this.state.children !== this.props.children
    ) {
      const newState = {}
      newState.children = this.props.children
      newState.renderedChildren = this.props.children
      this.setState(newState)
    }
  }

  componentWillUnmount() {
    Object.keys(this.timeouts).forEach(name =>
      clearTimeout(this.timeouts[name])
    )
  }

  onTransitionEnd = () => {
    const { transitionState } = this.state
    if (transitionState === 'exit-active') {
      this.setState({
        transitionState: 'out',
        renderedChildren: this.props.children,
      })
    } else if (transitionState === 'appear-active') {
      if (shouldTransition(this.state.children, this.props.children)) {
        this.setState({
          transitionState: 'exit',
          renderedChildren: this.state.children,
        })
        this.setTimeout('enter', this.onTransitionEnd, this.props.exitDuration)
      } else {
        this.setState({
          transitionState: 'in',
          renderedChildren: this.props.children,
        })
      }
    }
  }

  setTimeout(name, callback, delay) {
    if (this.timeouts[name]) clearTimeout(this.timeouts[name])
    this.timeouts[name] = setTimeout(callback, delay)
  }

  render() {
    const { renderedChildren, transitionState } = this.state
    console.log(transitionState)
    return renderedChildren
  }
}
