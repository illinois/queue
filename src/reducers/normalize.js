import { normalize, schema } from 'normalizr'

const question = new schema.Entity('questions')

const user = new schema.Entity('users')

const activeStaff = new schema.Entity('activeStaff', {
  user,
})
const activeStaffList = new schema.Array(activeStaff)

const queue = new schema.Entity('queues', {
  activeStaff: [activeStaff],
  questions: [question],
})

const course = new schema.Entity('courses', {
  queues: [queue],
  staff: [user],
})

export const normalizeQuestion = data => normalize(data, question)
export const normalizeUser = data => normalize(data, user)
export const normalizeActiveStaff = data => normalize(data, activeStaff)
export const normalizeActiveStaffList = data => normalize(data, activeStaffList)
export const normalizeQueue = data => normalize(data, queue)
export const normalizeCourse = data => normalize(data, course)
