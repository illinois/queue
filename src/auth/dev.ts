import { Request, Response } from 'express'
import { createOrUpdateUser, addJwtCookie } from './util'
import * as safeAsync from '../middleware/safeAsync'

/**
 * This is used for user impersonation during local dev; it trusts that the
 * client is allowed to become the specified user.
 *
 * DO NOT LET THIS ROUTE BE SERVED IN PRODUCTION.
 */
module.exports = safeAsync(
  async (req: Request, res: Response): Promise<void> => {
    const { uid }: { uid: string } = req.body

    const user = await createOrUpdateUser(req, uid)
    if (uid === 'dev@illinois.edu' && !user.isAdmin) {
      // This is a special user - let's make them an admin!
      user.isAdmin = true
      await user.save()
    }
    addJwtCookie(req, res, user)

    res.status(200).send()
  }
)
