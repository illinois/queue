/* eslint-env browser */
// We (supposedly) know what we're doing
/* eslint-disable react/no-did-update-set-state */
/* eslint-disable react/no-did-mount-set-state */
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Transition, CSSTransition } from 'react-transition-group'

import Loading from './Loading'

function areChildrenDifferent(oldChildren, newChildren) {
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

function shouldDelayEnter(children) {
  return React.isValidElement(children) && children.type.shouldDelayEnter
}

export default class TransitionManager extends React.Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    timeout: PropTypes.number,
  }

  static defaultProps = {
    timeout: 300,
  }

  constructor(props) {
    super(props)

    const { children } = props
    const delayedEnter = shouldDelayEnter(children)
    this.state = {
      state: 'enter',
      isIn: !delayedEnter,
      currentChildren: children,
      nextChildren: null,
      renderedChildren: children,
      /* We start with this so that the indicator will be shown when this page
      is SSRed */
      showLoading: true,
    }
  }

  componentDidMount() {
    if (shouldDelayEnter(this.props.children)) {
      this.setState({
        timeoutId: this.startEnterTimer(),
      })
    }
  }

  componentDidUpdate() {
    const {
      currentChildren,
      renderedChildren,
      nextChildren,
      isIn,
      state,
    } = this.state
    const { children } = this.props
    const hasNewChildren = areChildrenDifferent(currentChildren, children)
    const needsTransition = areChildrenDifferent(renderedChildren, children)
    if (hasNewChildren) {
      // We got a new set of children while we were transitioning some in
      // Immediately start transitioning out this component and update the next
      // component
      this.setState({
        isIn: false,
        nextChildren: children,
        currentChildren: children,
      })
      if (this.state.timeoutId) {
        clearTimeout(this.state.timeoutId)
      }
    } else if (needsTransition && !isIn && state === 'exited') {
      if (
        React.isValidElement(nextChildren) &&
        nextChildren.type.shouldDelayEnter
      ) {
        // Wait for the ready callback to actually transition in, but still
        // mount the component to allow it to start loading things
        this.setState({
          renderedChildren: nextChildren,
          nextChildren: null,
          timeoutId: this.startEnterTimer(),
        })
      } else {
        // No need to wait, mount immediately
        this.setState({
          isIn: true,
          renderedChildren: nextChildren,
          nextChildren: null,
        })
      }
    }
  }

  onEnter() {
    this.setState({
      state: 'enter',
      showLoading: false,
    })
  }

  onEntering() {
    this.setState({
      state: 'entering',
    })
  }

  onEntered() {
    this.setState({
      state: 'entered',
    })
  }

  onExit() {
    this.setState({
      state: 'exit',
    })
  }
  onExiting() {
    this.setState({
      state: 'exiting',
    })
  }

  onExited() {
    this.setState({
      renderedChildren: null,
      state: 'exited',
    })
  }

  onChildLoaded() {
    if (this.state.timeoutId) {
      clearTimeout(this.state.timeoutId)
    }
    this.setState({
      isIn: true,
      showLoading: false,
    })
  }

  startEnterTimer() {
    return setTimeout(() => {
      this.setState({
        showLoading: true,
      })
    }, 500)
  }

  render() {
    const { renderedChildren: children, state } = this.state
    const { timeout } = this.props
    if (this.state.state === 'entering' || this.state.state === 'exiting') {
      // Need to reflow!
      // eslint-disable-next-line no-unused-expressions
      if (document.body) document.body.scrollTop
    }

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
        <CSSTransition
          in={this.state.showLoading}
          mountOnEnter
          unmountOnExit
          classNames="indicator-fade"
          timeout={{
            enter: 200,
            exit: 0,
          }}
        >
          <Loading />
        </CSSTransition>
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
          .indicator-fade-appear,
          .indicator-fade-enter {
            opacity: 0;
          }
          .indicator-fade-appear-active,
          .indicator-fade-enter-active {
            opacity: 1;
            transition: opacity 200ms;
          }
        `}</style>
      </Fragment>
    )
  }
}
