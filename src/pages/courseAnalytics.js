import React from 'react'
import Select from '../components/Select'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Error from '../components/Error'
import PageWithUser from '../components/PageWithUser'
import { isUserCourseStaff, isUserAdmin } from '../selectors'
import axios from 'axios'
import * as d3 from 'd3'
import moment from 'moment'

import {
  fetchCourse,
  fetchCourseRequest,
  addCourseStaff,
  removeCourseStaff,
  updateCourse as updateCourseAction,
} from '../actions/course'

const CourseAnalytics = props => {
  if (!props.isUserAdmin && !props.isUserCourseStaff) {
    return <Error statusCode={403} />
  }

  const graphOptions = [
    { label: 'Hourly Usage Heatmap', value: 1 },
    { label: 'Test Graph', value: 2 },
  ]

  function showHourlyUsageHeatmap() {
    axios
      .get(`/api/courses/${props.courseId}/data/questions`, {})
      .then(res => {
        // data processing
        var dateBoundary = new Date().setDate(new Date().getDate() - 7)
        var weekdays = [
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
        ]
        var hours = [
          '12:00 am',
          '1:00 am',
          '2:00 am',
          '3:00 am',
          '4:00 am',
          '5:00 am',
          '6:00 am',
          '7:00 am',
          '8:00 am',
          '9:00 am',
          '10:00 am',
          '11:00 am',
          '12:00 pm',
          '1:00 pm',
          '2:00 pm',
          '3:00 pm',
          '4:00 pm',
          '5:00 pm',
          '6:00 pm',
          '7:00 pm',
          '8:00 pm',
          '9:00 pm',
          '10:00 pm',
          '11:00 pm',
        ]
        var dates = []

        for (var i = 0; i < weekdays.length; i++) {
          for (var j = 0; j < hours.length; j++) {
            dates.push({
              weekday: weekdays[i],
              hour: hours[j],
              count: 0,
            })
          }
        }

        var splitData = res.data.split('\n')
        var header = splitData[0].split(',')
        splitData.shift()
        var currentIndex = 0
        var line = splitData[currentIndex].split(',')
        var dateString = 'YYYY-MM-DD HH:mm:ss'

        // while the enqueue time is before the date boundary, keep going
        while (
          currentIndex < splitData.length &&
          moment(line[header.indexOf('enqueueTime')], dateString).toDate() >=
            new Date(dateBoundary)
        ) {
          var currentDate = moment(
            line[header.indexOf('enqueueTime')],
            dateString
          ).toDate()
          dates[currentDate.getDay() * 24 + currentDate.getHours()].count += 1
          currentIndex += 1
          line = splitData[currentIndex].split(',')
        }

        var maxCount = 0
        for (var i = 0; i < dates.length; i++) {
          if (dates[i].count > maxCount) {
            maxCount = dates[i].count
          }
        }

        var height = 750
        var width = document.getElementById('graph').offsetWidth

        var margin = { top: 50, right: 50, bottom: 50, left: 50 }
        width = width - margin.left - margin.right
        height = height - margin.top - margin.bottom

        d3.select('#svg').remove()
        d3.select('#tooltip').remove()

        var svg = d3
          .select('#graph')
          .append('svg')
          .attr('id', 'svg')
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr(
            'transform',
            'translate(' + margin.left + ',' + margin.top + ')'
          )

        var tooltip = d3
          .select('#graphContainer')
          .append('div')
          .attr('id', 'tooltip')
          .style('position', 'absolute')
          .style('white-space', 'pre')
          .style('opacity', 0)
          .style('background-color', 'white')
          .style('border', 'solid')
          .style('borer-width', '2px')
          .style('border-radius', '5px')
          .style('padding', '5px')

        var x = d3
          .scaleBand()
          .range([0, width])
          .domain(weekdays)
          .padding(0.05)

        svg
          .append('g')
          .style('font-size', 10)
          .attr('transform', 'translate(0,' + height + ')')
          .call(d3.axisBottom(x).tickSize(0))
          .select('.domain')
          .remove()

        var y = d3
          .scaleBand()
          .range([0, height])
          .domain(hours)
          .padding(0.05)

        svg
          .append('g')
          .style('font-size', 10)
          .call(d3.axisLeft(y).tickSize(0))
          .select('.domain')
          .remove()

        var colorScale = d3
          .scaleSequential()
          .interpolator(d3.interpolateInferno)
          .domain([0, maxCount])

        svg
          .selectAll()
          .data(dates, function(d) {
            return d.weekday + ':' + d.hour
          })
          .enter()
          .append('rect')
          .attr('x', function(d) {
            return x(d.weekday)
          })
          .attr('y', function(d) {
            return y(d.hour)
          })
          .attr('rx', 4)
          .attr('ry', 4)
          .attr('width', x.bandwidth())
          .attr('height', y.bandwidth())
          .style('fill', function(d) {
            return colorScale(d.count)
          })
          .style('stroke-width', 4)
          .style('stroke', 'none')
          .style('opacity', 0.8)
          .on('mouseover', function(d) {
            tooltip.style('opacity', 1)
            tooltip
              .html(
                'Weekday: ' +
                  d.weekday +
                  '\n' +
                  'Hour: ' +
                  d.hour +
                  '\n' +
                  'Number Enqueued: ' +
                  d.count +
                  '\n'
              )
              .style('top', event.pageY - 100 + 'px')
              .style('left', event.pageX + 10 + 'px')
          })
          .on('mouseout', function(d) {
            tooltip.style('opacity', 0)
          })
      })
      .catch(err => {
        console.error(err)
      })
  }

  function removeResizeListeners() {
    var eventListeners = [showHourlyUsageHeatmap]
    for (var i = 0; i < eventListeners.length; i++) {
      window.removeEventListener('resize', eventListeners[i])
    }
  }

  function graphChange(e) {
    removeResizeListeners()
    if (e.value == 1) {
      showHourlyUsageHeatmap()
      window.addEventListener('resize', showHourlyUsageHeatmap)
    }
  }

  return (
    <div id="graphContainer" className="container">
      <div className="row">
        <div className="col-md-4" />
        <div className="col-md-4">
          <Select options={graphOptions} onChange={graphChange} />
        </div>
        <div className="col-md-4" />
      </div>
      <div id="graph" style={{ display: 'flex', justifyContent: 'center' }} />
    </div>
  )
}

CourseAnalytics.getInitialProps = async ({ isServer, store, query }) => {
  const courseId = Number.parseInt(query.id, 10)
  if (isServer) {
    store.dispatch(fetchCourseRequest(courseId))
  }
  return { courseId }
}

CourseAnalytics.propTypes = {
  courseId: PropTypes.number.isRequired,
  isUserCourseStaff: PropTypes.bool.isRequired,
  isUserAdmin: PropTypes.bool.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  isUserCourseStaff: isUserCourseStaff(state, ownProps),
  isUserAdmin: isUserAdmin(state, ownProps),
})

export default connect(mapStateToProps)(PageWithUser(CourseAnalytics))
