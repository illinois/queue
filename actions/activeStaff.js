import * as types from '../constants/ActionTypes'
import { makeActionCreator } from './util'

/**
 * Update all activeStaff for a queue
 */
// eslint-disable-next-line import/prefer-default-export
export const updateActiveStaff = makeActionCreator(types.UPDATE_ACTIVE_STAFF, 'queueId', 'activeStaff')
