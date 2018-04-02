/* eslint-env browser */
import {
  CREATE_QUESTION,
  UPDATE_QUESTION_ANSWERING,
} from '../constants/ActionTypes'
import { baseUrl } from '../util'

function sendNotificationIfAllowed(title, options) {
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
      }
    }
  }
}

function isOnDutyStaff(activeStaff, user) {
  return Object.keys(activeStaff).some(
    key => activeStaff[key].userId === user.id
  )
}

export default store => next => action => {
  const state = store.getState()
  const { user } = state.user
  console.log(action.type)
  // Notification for new questions added to on-duty staffs
  if (action.type === CREATE_QUESTION.SUCCESS) {
    const { activeStaff } = state.activeStaff
    // On duty staff cannot ask questions, so no need to filter by askedById
    if (isOnDutyStaff(activeStaff, user)) {
      const title = 'New question'
      const { name, location } = action.question

      const options = {
        body: `Name: ${name}\nLocation: ${location}`,
        icon: `${baseUrl}/static/notif_icon.png`,
      }
      sendNotificationIfAllowed(title, options)
    }
    // Notification for question being answered by staff to student
  } else if (action.type === UPDATE_QUESTION_ANSWERING.SUCCESS) {
    console.log(action)
  }
  return next(action)
}
