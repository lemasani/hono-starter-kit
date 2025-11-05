import type { AppBindings } from '@/lib/types'

import { createMiddleware } from 'hono/factory'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import * as HttpStatusPhrases from 'stoker/http-status-phrases'

import { auth } from '@/lib/auth'

export const authMiddleware = createMiddleware<AppBindings>(async (c, next) => {
  const { logger } = c.var
  const session = await auth.api.getSession({ headers: c.req.raw.headers })

  if (!session) {
    logger.warn({ path: c.req.path, method: c.req.method }, 'Unauthorized access attempt')
    return c.json(
      { message: HttpStatusPhrases.UNAUTHORIZED },
      HttpStatusCodes.UNAUTHORIZED,
    )
  }

  c.set('user', session.user)
  c.set('session', session.session)
  logger.debug({ userId: session.user.id, path: c.req.path }, 'User authenticated')

  return next()
})
