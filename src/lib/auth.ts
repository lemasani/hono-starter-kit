import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { createAuthMiddleware } from 'better-auth/api'
import { openAPI } from 'better-auth/plugins'
import db from '@/db/index.js'
import { seedDefaultCategories } from '@/db/seed.js'

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  telemetry: {
    enabled: false,
  },
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    openAPI(),
  ],
  hooks: {
    after: createAuthMiddleware(async (ctx) => {
      // Seed default categories when a new user signs up
      if (ctx.path.startsWith('/sign-up')) {
        const newSession = ctx.context.newSession
        if (newSession) {
          await seedDefaultCategories(newSession.user.id)
        }
      }
    }),
  },
})
