import { relations } from 'drizzle-orm'
import {
  boolean,
  pgTable,
  text,
  timestamp,
} from 'drizzle-orm/pg-core'

import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

// ========================================
// Better-Auth Tables (Required)
// ========================================

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified')
    .$defaultFn(() => false)
    .notNull(),
  image: text('image'),
  createdAt: timestamp('created_at')
    .$defaultFn(() => new Date())
    .notNull(),
  updatedAt: timestamp('updated_at')
    .$defaultFn(() => new Date())
    .notNull(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull(),
  updatedAt: timestamp('updated_at').notNull(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').$defaultFn(
    () => new Date(),
  ),
  updatedAt: timestamp('updated_at').$defaultFn(
    () => new Date(),
  ),
})

// ========================================
// Your Application Schema
// ========================================

// Add your application-specific tables here
// Example:
//
// export const post = pgTable('post', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   userId: text('user_id')
//     .notNull()
//     .references(() => user.id, { onDelete: 'cascade' }),
//   title: text('title').notNull(),
//   content: text('content').notNull(),
//   createdAt: timestamp('created_at')
//     .$defaultFn(() => new Date())
//     .notNull(),
//   updatedAt: timestamp('updated_at')
//     .$defaultFn(() => new Date())
//     .notNull(),
// })
//
// export const postInsertSchema = createInsertSchema(post, {
//   title: schema => schema.min(1).max(255),
//   content: schema => schema.min(1),
// }).omit({
//   id: true,
//   userId: true,
//   createdAt: true,
//   updatedAt: true,
// })
//
// export const postSelectSchema = createSelectSchema(post)

// ========================================
// Relations
// ========================================

export const userRelations = relations(user, ({ many }) => ({
  // Add your user relations here
  // Example: posts: many(post)
}))

// Add more relations as needed
