import type { OpenAPIHono, RouteConfig, RouteHandler } from '@hono/zod-openapi'
import type { Schema } from 'hono'
import type { PinoLogger } from 'hono-pino'
import type { auth } from './auth'

export interface AppBindings {
  Variables: {
    logger: PinoLogger
    user: typeof auth.$Infer.Session.user
    session: typeof auth.$Infer.Session.session
  }
};

// eslint-disable-next-line ts/no-empty-object-type
export type AppOpenAPI<S extends Schema = {}> = OpenAPIHono<AppBindings, S>

// Helper type to exclude middleware-handled responses (like 401) from route handler signatures
export type ExcludeAuthResponses<R extends RouteConfig> = Omit<R, 'responses'> & {
  responses: Omit<R['responses'], 401>
}

// Combined type that automatically excludes auth responses from route handlers
export type AppRouteHandler<R extends RouteConfig> = RouteHandler<ExcludeAuthResponses<R>, AppBindings>
