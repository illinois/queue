import { createSelector } from 'reselect'

const userSelector = state => state.user.user
const courseSelector = (state, props) => state.courses.courses[props.courseId]
const courseIdForQueueSelector = (state, props) => {
  const queue = state.queues.queues[props.queueId]
  return queue ? queue.courseId : null
}
const queueSelector = (state, props) => state.queues.queues[props.queueId]
const activeStaffSelector = state => state.activeStaff.activeStaff
const questionsSelector = state => state.questions.questions

export const getActiveStaff = createSelector(
  [queueSelector, activeStaffSelector],
  (queue, activeStaff) => {
    if (!queue) {
      return []
    }
    return queue.activeStaff.map(
      activeStaffId => activeStaff[activeStaffId].user
    )
  }
)

export const isUserActiveStaffForQueue = createSelector(
  [queueSelector, activeStaffSelector, userSelector],
  (queue, activeStaff, user) => {
    if (!queue || !queue.activeStaff) {
      return false
    }
    const idx = queue.activeStaff.findIndex(
      asId => activeStaff[asId].user === user.id
    )
    return idx !== -1
  }
)

export const isUserCourseStaffForQueue = createSelector(
  [userSelector, courseIdForQueueSelector],
  (user, courseId) => {
    try {
      // Blindly assume we can walk deep into objects, and fail if we can't
      // access any required properties
      // eslint-disable-next-line prefer-destructuring
      return user.staffAssignments.indexOf(courseId) !== -1
    } catch (e) {
      return false
    }
  }
)

export const isUserCourseStaff = createSelector(
  [userSelector, courseSelector],
  (user, course) => {
    try {
      // Blindly assume we can walk deep into objects, and fail if we can't
      // access any required properties
      // eslint-disable-next-line prefer-destructuring
      return user.staffAssignments.indexOf(course.id) !== -1
    } catch (e) {
      return false
    }
  }
)

export const getUserActiveQuestionIdForQueue = createSelector(
  [userSelector, queueSelector, questionsSelector],
  (user, queue, questions) => {
    if (!queue || !queue.questions) {
      return -1
    }
    const userQuestionId = queue.questions.find(qid => {
      const belongsToQueue = questions[qid].queueId === queue.id
      const belongsToUser = questions[qid].askedById === user.id
      return belongsToQueue && belongsToUser
    })
    return Number.parseInt(userQuestionId, 10) || -1
  }
)

export const isUserAdmin = createSelector(
  [userSelector],
  user => user && user.isAdmin
)

export const isUserAnsweringQuestionForQueue = createSelector(
  [userSelector, queueSelector, questionsSelector],
  (user, queue, questions) => {
    if (!queue || !queue.questions) {
      return false
    }

    return queue.questions.some(
      questionId => questions[questionId].answeredById === user.id
    )
  }
)

export const isUserStudent = createSelector(
  [isUserAdmin, isUserCourseStaff, isUserCourseStaffForQueue],
  (isAdmin, isCourseStaff, isCourseStaffForQueue) =>
    !(isAdmin || isCourseStaff || isCourseStaffForQueue)
)

export const isQueueStarred = createSelector(
  [userSelector, queueSelector],
  (user, queue) => {
    if (!user || !queue) {
      return false
    }

    return user.starredQueues.find(sQueue => sQueue.id === queue.id) != null
  }
)
