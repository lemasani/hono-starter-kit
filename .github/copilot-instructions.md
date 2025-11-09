# Hono Starter Kit - AI Coding Instructions

## Architecture Overview

This is a **Hono.js** REST API with Better-Auth, Drizzle ORM (PostgreSQL), and OpenAPI documentation. The app uses ESM modules, path aliases (`@/`), and runs on Node.js with the `@hono/node-server` adapter.

### Key Components

- **App Factory** (`src/lib/create-app.ts`): Creates OpenAPIHono instances with middleware pipeline (request ID → emoji favicon → auth handler → pino logger → error handlers)
- **Route Assembly** (`src/app.ts`): Imports routers and mounts them with `app.route('/', router)` pattern
- **Auth Integration**: Better-Auth handles `/api/auth/**` routes automatically via `auth.handler(c.req.raw)` in the middleware chain
- **Type Safety**: `AppBindings` provides typed context variables (`logger`, `user`, `session`); `AppRouteHandler<T>` automatically excludes middleware-handled responses

## Development Workflow

### Essential Commands

```bash
pnpm dev              # Hot reload with tsx watch
pnpm db:up            # Start PostgreSQL (docker-compose)
pnpm db:push          # Push schema changes (dev - no migrations)
pnpm db:generate      # Generate migrations from schema.ts
pnpm db:studio        # Open Drizzle Studio on http://localhost:4983
```

### Database Changes

1. Modify `src/db/schema.ts` (snake_case casing enforced)
2. For dev: `pnpm db:push` (fast, no migration files)
3. For prod: `pnpm db:generate` then `pnpm db:migrate`
4. Always use `createInsertSchema()` and `createSelectSchema()` from `drizzle-zod` for validation

## Code Conventions

### Route Structure (3-File Pattern)

**DO NOT** inline routes in `app.ts`. Always create separate route modules:

```
src/routes/
  users/
    users.route.ts     # createRoute() definitions with OpenAPI schemas
    users.handlers.ts  # AppRouteHandler implementations
    users.index.ts     # Router assembly with createRouter()
```

**Route Definition** (`*.route.ts`):

```typescript
import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";

export const list = createRoute({
  tags: ["Users"],
  method: "get",
  path: "/users",
  responses: {
    [HttpStatusCodes.OK]: jsonContent(schema, "description"),
  },
});
```

**Handler** (`*.handlers.ts`):

```typescript
import type { AppRouteHandler } from "@/lib/types";
import type { ListRoute } from "./users.route";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const { user } = c.var; // Available after authMiddleware
  return c.json(data, HttpStatusCodes.OK);
};
```

**Router Assembly** (`*.index.ts`):

```typescript
import { createRouter } from "@/lib/create-app";
import { authMiddleware } from "@/middlewares/auth-middleware";
import * as handlers from "./users.handlers";
import * as routes from "./users.route";

const router = createRouter();
router.use(authMiddleware); // Apply to protect routes
router.openapi(routes.list, handlers.list);
export default router;
```

### Path Aliases

Always use `@/` for imports: `import db from '@/db/index.js'`

- Include `.js` extension for local ESM modules (TypeScript config requirement)
- Build uses `tsc-alias` to resolve paths

### Schema Patterns

```typescript
// In src/db/schema.ts
export const post = pgTable("post", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at")
    .$defaultFn(() => new Date())
    .notNull(),
});

// Generate Zod schemas with refinements
export const postInsertSchema = createInsertSchema(post, {
  title: (schema) => schema.min(1).max(255),
}).omit({ id: true, userId: true, createdAt: true });
```

### Authentication

- Protected routes: Apply `authMiddleware` before route handlers
- Access user: `const { user, session } = c.var` in handlers
- Auth endpoints auto-generated at `/api/auth/reference` (Better-Auth OpenAPI plugin)
- User/session types inferred from `auth.$Infer.Session`
- **Better-Auth Reference**: For detailed documentation on Better-Auth features, plugins, and configuration, see https://better-auth.com/llms.txt

### Logging

Use typed logger from context: `c.var.logger.info({ userId }, 'message')`

- Pino with pretty printing in dev
- Log level controlled by `LOG_LEVEL` env var

### Type Helpers

- `AppRouteHandler<R>`: Excludes middleware responses (like 401) from handler types
- `ExcludeAuthResponses<R>`: Utility for removing auth responses from route configs
- `AppBindings`: Context variable types for all routes

## Environment Setup

Required `.env` variables (see `src/env.ts` for validation):

```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
BETTER_AUTH_SECRET=generate-random-secret
BETTER_AUTH_URL=http://localhost:3000
```

## Common Pitfalls

- Don't forget `.js` extensions in imports for local modules
- Use `HttpStatusCodes` from `stoker` (not magic numbers)
- Register new routers in `src/app.ts` routes array
- Better-Auth tables (`user`, `session`, `account`, `verification`) are required - don't delete
- Use `jsonContent()` from `stoker/openapi/helpers` for OpenAPI response schemas
- Drizzle casing is snake_case (configured in both `drizzle.config.ts` and `src/db/index.ts`)
