import React from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import mdf from 'moment-duration-format'

mdf(moment)

class CountUpTimer extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      time: '00:00',
    }

    this.interval = null
  }

  componentDidMount() {
    this.interval = setInterval(this.update.bind(this), 100)
    this.update()
  }

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
  }

  update() {
    const start = moment(this.props.startTime)
    const diff = moment
      .duration(moment().diff(start))
      .format('mm:ss', { trim: false })
    this.setState({ time: diff })
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { startTime, tag: Tag, ...rest } = this.props
    return <Tag {...rest}>{this.state.time}</Tag>
  }
}

CountUpTimer.defaultProps = {
  tag: 'div',
}

CountUpTimer.propTypes = {
  startTime: PropTypes.string.isRequired,
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
}

export default CountUpTimer
