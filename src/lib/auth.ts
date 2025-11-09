import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { openAPI } from 'better-auth/plugins'
import db from '@/db/index.js'

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
})
