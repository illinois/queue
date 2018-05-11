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

export default class TransitionManager extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      state: 'enter',
      isIn: true,
      renderedChildren: props.children,
    }
  }

  componentDidUpdate() {
    const { renderedChildren, isIn, state } = this.state
    const { children } = this.props
    const needsTransition = shouldTransition(renderedChildren, children)
    if (needsTransition && isIn && state === 'entered') {
      console.log('outgoing!')
      this.setState({
        isIn: false,
      })
    } else if (needsTransition && !isIn && state === 'exited') {
      console.log('incoming!')
      this.setState({
        isIn: true,
        renderedChildren: this.props.children,
      })
    }
  }

  onEnter() {
    console.log('onEnter!')
    this.setState({
      state: 'enter',
    })
  }

  onEntering() {
    console.log('onEntering!')
    this.setState({
      state: 'entering',
    })
  }

  onEntered() {
    console.log('onEntered!')
    this.setState({
      state: 'entered',
    })
  }

  onExit() {
    console.log('onExit!')
    this.setState({
      state: 'exit',
    })
  }
  onExiting() {
    console.log('onExiting!')
    this.setState({
      state: 'exiting',
    })
  }

  onExited() {
    console.log('onExited!')
    this.setState({
      renderedChildren: null,
      state: 'exited',
    })
  }

  onChildLoaded() {
    console.log('READY ENTER')
  }

  render() {
    const { renderedChildren: children, state } = this.state
    if (this.state.state === 'entering' || this.state.state === 'exiting') {
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
          <div className={buildClassName('fade', state)}>
            {children &&
              React.cloneElement(children, {
                onLoaded: () => this.onChildLoaded(),
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
