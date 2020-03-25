/* eslint-env browser */
import {
  CREATE_QUESTION,
  DELETE_QUESTION,
  UPDATE_QUESTION,
} from '../constants/ActionTypes'
import { baseUrl } from '../util'

const notifications = {}

function sendNotificationIfEnabled(title, options, queueId, questionId) {
  if (
    typeof window !== 'undefined' &&
    window.localStorage &&
    window.localStorage.getItem('notificationsEnabled') === 'true'
  ) {
    if (Notification.permission === 'granted') {
      const n = new Notification(title, options)
      n.onclick = () => {
        window.focus()
        n.close()
        delete notifications[queueId][questionId]
      }
      if (!(queueId in notifications)) {
        notifications[queueId] = {}
      }
      notifications[queueId][questionId] = n
    }
  }
}

function closeNotification(queueId, questionId) {
  if (!(queueId in notifications)) {
    return
  }
  if (!(questionId in notifications[queueId])) {
    return
  }
  notifications[queueId][questionId].close()
  delete notifications[queueId][questionId]
}

function isOnDutyStaff(activeStaff, user, queueId) {
  return Object.keys(activeStaff).some(
    key =>
      activeStaff[key].userId === user.id &&
      activeStaff[key].queueId === queueId
  )
}

export default store => next => action => {
  const state = store.getState()
  const { user } = state.user

  // Notification for new questions added to on-duty staffs
  if (action.type === CREATE_QUESTION.SUCCESS) {
    const { activeStaff } = state.activeStaff
    // On duty staff cannot ask questions, so no need to filter by askedById
    const { id, name, location, queueId } = action.question
    const queue = state.queues.queues[queueId]
    if (isOnDutyStaff(activeStaff, user, queueId)) {
      const title = 'New question'
      let body = ''

      if (queue.fixedLocation) {
        body = `Name: ${name}`
      } else {
        body = `Name: ${name}\nLocation: ${location}`
      }

      const options = {
        body,
        icon: `${baseUrl}/static/notif_icon.png`,
        tag: `queue-${queueId}/question-${id}`,
      }
      sendNotificationIfEnabled(title, options, queueId, id)
    }
    // Notification for question being answered by staff to student
    // Note: Only UPDATE_QUESTION action will happen on student's side, but not UPDATE_QUESTION_ANSWERING
  } else if (action.type === UPDATE_QUESTION.SUCCESS) {
    const { question } = action
    const { activeStaff } = state.activeStaff
    if (isOnDutyStaff(activeStaff, user, question.queueId)) {
      // Close question creation notification
      closeNotification(question.queueId, question.id)
    }

    const markedBeingAnswered =
      !state.questions.questions[question.id].beingAnswered &&
      question.beingAnswered
    if (user.id === question.askedById) {
      const { id, queueId } = question

      // If question is marked as being answered and it is the user who asked this question
      if (markedBeingAnswered) {
        const name = question.answeredBy.name || question.answeredBy.uid
        const title = `${name} is answering your question`

        const options = {
          icon: `${baseUrl}/static/notif_icon.png`,
          tag: `queue-${queueId}/question-${id}`,
        }
        sendNotificationIfEnabled(title, options, queueId, id)
      } else {
        closeNotification(queueId, id)
      }
    }
  } else if (action.type === DELETE_QUESTION.SUCCESS) {
    const { questionId, queueId } = action
    closeNotification(queueId, questionId)
  }
  return next(action)
}
