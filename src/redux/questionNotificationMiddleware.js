/* eslint-env browser */
import { CREATE_QUESTION } from '../constants/ActionTypes'
import { baseUrl } from '../util'

export default store => next => action => {
  if (action.type === CREATE_QUESTION.SUCCESS) {
    const state = store.getState()
    // We obviously want to avoid notifying ourselves
    if (state.user.user.id !== action.question.askedById) {
      if (
        typeof window !== 'undefined' &&
        window.localStorage &&
        window.localStorage.getItem('notificationsEnabled') === 'true'
      ) {
        if (Notification.permission === 'granted') {
          const { name, location } = action.question

          const options = {
            body: `Name: ${name}\nLocation: ${location}`,
            icon: `${baseUrl}/static/notif_icon.png`,
          }
          const n = new Notification('New question', options)
          n.onclick = () => {
            window.focus()
            n.close()
          }
        }
      }
    }
  }

  return next(action)
}
