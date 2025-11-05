import type { Schema } from 'hono'

import type { AppBindings, AppOpenAPI } from '@/lib/types.js'
import { OpenAPIHono } from '@hono/zod-openapi'
import { requestId } from 'hono/request-id'
import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares'

import { defaultHook } from 'stoker/openapi'

import { auth } from '@/lib/auth.js'
import { pinoLogger } from '@/middlewares/pino-logger.js'

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  })
}

export default function createApp() {
  const app = createRouter()
  app.use(requestId())
    .use(serveEmojiFavicon('📝'))
    .on(['POST', 'GET'], '/api/auth/**', c => auth.handler(c.req.raw))
    .use(pinoLogger())

  app.notFound(notFound)
  app.onError(onError)
  return app
}

export function createTestApp<S extends Schema>(router: AppOpenAPI<S>) {
  return createApp().route('/', router)
}
