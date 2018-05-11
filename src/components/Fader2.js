import React, { Fragment } from 'react'
import { Transition } from 'react-transition-group'

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

function buildClassName(className, state) {
  switch (state) {
    case 'enter':
      return `${className}-enter`
    case 'entering':
      return `${className}-enter ${className}-enter-active`
    case 'entered':
      return `${className}-enter-done`
    case 'exit':
      return `${className}-exit`
    case 'exiting':
      return `${className}-exit ${className}-exit-active`
    case 'exited':
      return `${className}-exit-done`
    default:
      return ''
  }
}

export default class Fader2 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      state: 'in',
      isIn: true,
      renderedChildren: props.children,
    }
  }

  componentDidUpdate() {
    const { renderedChildren, isIn, state } = this.state
    const { children } = this.props
    const needsTransition = shouldTransition(renderedChildren, children)
    if (needsTransition && isIn && state === 'in') {
      console.log('outgoing!')
      this.setState({
        isIn: false,
      })
    } else if (needsTransition && !isIn && state === 'out') {
      console.log('incoming!')
      this.setState({
        isIn: true,
        renderedChildren: this.props.children,
      })
    }
  }

  onEnter(node) {
    console.log('onEnter!')
    this.setState({
      transitionState: 'enter',
      node,
    })
  }

  onEntering() {
    console.log('onEntering!')
    this.setState({
      transitionState: 'entering',
    })
  }

  onEntered() {
    console.log('onEntered!')
    this.setState({
      state: 'in',
      transitionState: 'entered',
    })
  }

  onExit() {
    console.log('onExit!')
    this.setState({
      transitionState: 'exit',
    })
  }
  onExiting() {
    console.log('onExiting!')
    this.setState({
      transitionState: 'exiting',
    })
  }

  onExited() {
    console.log('onExited!')
    this.setState({
      state: 'out',
      renderedChildren: null,
      transitionState: 'exited',
    })
  }

  readyEnter() {
    console.log('READY ENTER')
  }

  render() {
    const { renderedChildren: children, transitionState } = this.state
    if (
      this.state.transitionState === 'entering' ||
      this.state.transitionState === 'exiting'
    ) {
      // Need to reflow!
      document.body && document.body.scrollTop
    }

    if (React.isValidElement(children)) {
      // Nith
      children.type.shouldDelayEnter && console.log('DELAYING ENTER')
    }

    const timeout = this.props.timeout || 300

    return (
      <Fragment>
        <Transition
          timeout={timeout}
          in={this.state.isIn}
          appear
          onEnter={() => this.onEnter()}
          onEntering={() => this.onEntering()}
          onEntered={() => this.onEntered()}
          onExit={() => this.onExit()}
          onExiting={() => this.onExiting()}
          onExited={() => this.onExited()}
        >
          <div
            className={buildClassName('fade', transitionState)}
            style={{ position: 'relative' }}
          >
            {children &&
              React.cloneElement(children, {
                onReadyEnter: () => this.readyEnter(),
              })}
          </div>
        </Transition>
        <style jsx global>{`
          .fade-appear,
          .fade-enter {
            opacity: 0;
            transform: translate3d(0, 20px, 0);
          }
          .fade-appear-active,
          .fade-enter-active {
            opacity: 1;
            transform: translate3d(0, 0, 0);
            transition: opacity ${timeout}ms, transform ${timeout}ms;
          }
          .fade-exit {
            opacity: 1;
          }
          .fade-exit-active {
            opacity: 0;
            transition: opacity ${timeout}ms;
          }
        `}</style>
      </Fragment>
    )
  }
}
