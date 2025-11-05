# Hono Starter Kit

A production-ready starter template for building TypeScript APIs with Hono.js, featuring authentication, database ORM, and auto-generated API documentation.

## 🚀 Features

- **⚡ [Hono.js](https://hono.dev/)** - Ultra-fast web framework
- **🔐 [Better-Auth](https://www.better-auth.com/)** - Complete authentication solution
- **🗄️ [Drizzle ORM](https://orm.drizzle.team/)** - TypeScript ORM with migrations
- **📚 [OpenAPI 3.0](https://www.openapis.org/)** - Auto-generated API documentation
- **📖 [Scalar](https://scalar.com/)** - Beautiful interactive API docs
- **✅ [Zod](https://zod.dev/)** - TypeScript-first schema validation
- **📝 [Pino](https://getpino.io/)** - Fast JSON logger
- **🐘 PostgreSQL** - Robust relational database
- **🔧 ESM** - Native ES Modules support
- **🎯 TypeScript** - Full type safety

## 📋 Prerequisites

- Node.js 20+
- pnpm (or npm/yarn)
- Docker (for PostgreSQL)

## 🛠️ Quick Start

### 1. Clone or use this template

```bash
git clone <your-repo-url>
cd hono-starter-kit
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env` file in the root:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/myapp

# Server
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug

# Better-Auth (generate random secrets)
BETTER_AUTH_SECRET=your-secret-key-here
BETTER_AUTH_URL=http://localhost:3000
```

### 4. Start PostgreSQL

```bash
pnpm db:up
```

### 5. Run database migrations

```bash
pnpm db:push
```

### 6. Start development server

```bash
pnpm dev
```

Server runs at `http://localhost:3000`

## 📚 API Documentation

- **Interactive docs**: <http://localhost:3000/reference>
- **Auth endpoints**: <http://localhost:3000/api/auth/reference>
- **OpenAPI spec**: <http://localhost:3000/doc>

## 🏗️ Project Structure

```tree
hono-starter-kit/
├── src/
│   ├── app.ts                 # App assembly & route registration
│   ├── index.ts              # Server entry point
│   ├── env.ts                # Environment variables validation
│   ├── db/
│   │   ├── index.ts          # Database connection
│   │   ├── schema.ts         # Drizzle schema definitions
│   │   └── migrations/       # Database migrations
│   ├── lib/
│   │   ├── auth.ts           # Better-Auth configuration
│   │   ├── configure-open-api.ts  # OpenAPI setup
│   │   ├── constants.ts      # Shared constants
│   │   ├── create-app.ts     # App factory
│   │   └── types.ts          # Shared TypeScript types
│   ├── middlewares/
│   │   ├── auth-middleware.ts     # Authentication middleware
│   │   └── pino-logger.ts         # Logging middleware
│   └── routes/
│       └── index.route.ts    # Example route
├── docker-compose.yaml       # PostgreSQL container
├── drizzle.config.ts        # Drizzle Kit configuration
├── tsconfig.json            # TypeScript configuration
└── package.json
```

## 🔧 Available Scripts

```bash
# Development
pnpm dev              # Start dev server with hot reload
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:up            # Start PostgreSQL container
pnpm db:generate      # Generate migrations from schema changes
pnpm db:migrate       # Apply migrations
pnpm db:push          # Push schema changes (dev only)
pnpm db:studio        # Open Drizzle Studio GUI

# Code Quality
pnpm lint             # Lint code
pnpm lint:fix         # Lint and fix
pnpm typecheck        # Check TypeScript types

# Documentation
pnpm openapi:docs     # Open API documentation
pnpm openapi:auth     # Open auth API documentation
```

## 📝 Adding New Features

### Creating a New Route

1. **Create route definition** (`src/routes/users/users.route.ts`):

```typescript
import { createRoute, z } from '@hono/zod-openapi'
import * as HttpStatusCodes from 'stoker/http-status-codes'
import { jsonContent } from 'stoker/openapi/helpers'

export const list = createRoute({
  tags: ['Users'],
  method: 'get',
  path: '/users',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(z.object({ id: z.string(), name: z.string() })),
      'List of users'
    ),
  },
})
```

2. **Create handler** (`src/routes/users/users.handlers.ts`):

```typescript
import type { AppRouteHandler } from '@/lib/types'
import type { ListRoute } from './users.route'

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const users = await db.query.user.findMany()
  return c.json(users)
}
```

3. **Assemble router** (`src/routes/users/users.index.ts`):

```typescript
import { createRouter } from '@/lib/create-app'
import { authMiddleware } from '@/middlewares/auth-middleware'
import * as handlers from './users.handlers'
import * as routes from './users.route'

const router = createRouter()
router.use(authMiddleware) // Optional: protect routes
router.openapi(routes.list, handlers.list)

export default router
```

4. **Register in app** (`src/app.ts`):

```typescript
import users from '@/routes/users/users.index'

const routes = [index, users] as const
routes.forEach((route) => app.route('/', route))
```

### Adding Database Tables

1. **Define schema** (`src/db/schema.ts`):

```typescript
export const post = pgTable('post', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
})

export const postInsertSchema = createInsertSchema(post).omit({
  id: true,
  userId: true,
  createdAt: true,
})
```

2. **Generate migration**:

```bash
pnpm db:generate
```

3. **Apply migration**:

```bash
pnpm db:migrate
```

## 🔐 Authentication

The template includes Better-Auth with email/password authentication:

### Sign Up

```bash
POST /api/auth/sign-up
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword",
  "name": "John Doe"
}
```

### Sign In

```bash
POST /api/auth/sign-in
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

### Protected Routes

Use `authMiddleware` to protect routes:

```typescript
router.use(authMiddleware)
router.openapi(routes.create, handlers.create)
```

Access authenticated user in handlers:

```typescript
export const create: AppRouteHandler<CreateRoute> = async (c) => {
  const { user } = c.var  // Authenticated user
  // ... your logic
}
```

## 🚀 Deployment

### Build

```bash
pnpm build
```

### Run

```bash
pnpm start
```

### Environment Variables

Set these in your production environment:

- `DATABASE_URL` - PostgreSQL connection string
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Set to `production`
- `BETTER_AUTH_SECRET` - Secret key for auth tokens
- `BETTER_AUTH_URL` - Your production URL

## 📖 Resources

- [Hono Documentation](https://hono.dev/)
- [Better-Auth Documentation](https://www.better-auth.com/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team/)
- [OpenAPI Specification](https://swagger.io/specification/)

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## 📄 License

MIT License - feel free to use this template for your projects!
