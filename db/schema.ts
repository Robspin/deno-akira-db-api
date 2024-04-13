// import { boolean, pgTable, text, timestamp, uuid } from 'npm:drizzle-orm/pg-core'
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const strategies = pgTable('strategies', {
    id: uuid('id').primaryKey(),
    name: text('name').notNull().unique(),
    active: boolean('active').default(false),
    inTrade: boolean('in_trade').default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    deletedAt: timestamp('deleted_at'),
})

export const trades = pgTable('trades', {
    id: uuid('id').primaryKey(),
    direction: text('direction').notNull(),
    orderId: text('trade_id').notNull(),
    entryPrice: text('entry_price').notNull(),
    entryAccountSize: text('entry_account_size').notNull(),
    size:  text('size').notNull(),
    currentBtcPrice:  text('currentBtcPrice').notNull(),
    exitPrice: text('exit_price'),
    extAccountSize: text('exit_account_size'),
    strategyName: text('strategy_name').notNull().references(() => strategies.name),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    exitedTradeAt: timestamp('exited_trade_at'),
    deletedAt: timestamp('deleted_at')
})
