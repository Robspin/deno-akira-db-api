import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import { v4 as uuidv4 } from 'npm:uuid'
import { neon } from 'npm:@neondatabase/serverless'
import { drizzle } from 'npm:drizzle-orm/neon-http'
import { eq } from 'npm:drizzle-orm'
import { env } from './constants.ts'
import * as schema from "./db/schema.ts"
import { running } from './akira-art.ts'
import { isAuthorized } from "./helpers.ts"
import { strategies, trades } from './db/schema.ts'
import { TradePostData, TradeUpdateData } from './types.ts'
import { desc } from 'drizzle-orm'

const sql = neon(env.DB_CONNECTION_STRING!)
const db = drizzle(sql, { schema })

const port = 8000
const app = new Application()
const router = new Router()

router.get('/', async (ctx) => {
  ctx.response.body = running
})

router.get('/strategies', async (ctx) => {
  if (!isAuthorized(ctx)) return
  const data = await db.query.strategies.findMany()

  ctx.response.body = {
    success: true,
    data: data,
    message: 'Successfully fetched data'
  }
})

router.get('/strategies/:name', async (ctx) => {
  if (!isAuthorized(ctx)) return
  const data = await db.query.strategies.findFirst({
    where: ((strat, { eq }) => eq(strat.name, ctx.params.name ?? 'null')),
  })

  ctx.response.body = {
    success: true,
    data: data,
    message: 'Successfully fetched data'
  }
})

router.put('/strategies/:name', async (ctx) => {
  if (!isAuthorized(ctx)) return
  const body: { active: boolean, inTrade: boolean } = await ctx.request.body.json()

  await db.update(strategies).set({
    ...body,
    updatedAt: new Date()
  }).where(eq(strategies.name, ctx.params.name ?? 'null'))
  const data = await db.query.strategies.findFirst({
    where: ((strat, { eq }) => eq(strat.name, ctx.params.name ?? 'null')),
  })

  ctx.response.body = {
    success: true,
    data: data,
    message: 'Successfully fetched data'
  }
})

router.post('/trades', async (ctx) => {
  if (!isAuthorized(ctx)) return
  const body: TradePostData = await ctx.request.body.json()
  const id = uuidv4()

  await db.insert(trades).values({
    id,
    ...body
  })

  const data = await db.query.trades.findFirst({
    where: ((trade, { eq }) => eq(trade.id, id)),
  })

  ctx.response.body = {
    success: true,
    data,
    message: 'Successfully created trade'
  }
})

router.get('/trades', async (ctx) => {
  if (!isAuthorized(ctx)) return
  const data = await db.query.trades.findMany()

  ctx.response.body = {
    success: true,
    data,
    message: 'Successfully fetched data'
  }
})

router.get('/strategies/:name/trades', async (ctx) => {
  if (!isAuthorized(ctx)) return
  const data = await db.query.trades.findMany({
    where: ((trade, { eq }) => eq(trade.strategyName, ctx.params.name ?? 'null')),
    orderBy: [desc(trades.createdAt)]
  })

  ctx.response.body = {
    success: true,
    data,
    message: 'Successfully fetched data'
  }
})

router.get('/trades/orders/:id', async (ctx) => {
  if (!isAuthorized(ctx)) return
  const data = await db.query.trades.findFirst({
    where: ((trade, { eq }) => eq(trade.orderId, ctx.params.id ?? 'null')),
  })

  ctx.response.body = {
    success: true,
    data,
    message: 'Successfully fetched data'
  }
})

router.put('/trades/orders/:id', async (ctx) => {
  if (!isAuthorized(ctx)) return
  const body: TradeUpdateData = await ctx.request.body.json()

  await db.update(trades).set({
    ...body,
    updatedAt: new Date(),
    exitedTradeAt: new Date()
  }).where(eq(trades.orderId, ctx.params.id ?? 'null'))

  const data = await db.query.trades.findFirst({
    where: ((trade, { eq }) => eq(trade.orderId, ctx.params.id ?? 'null')),
  })

  ctx.response.body = {
    success: true,
    data: data,
    message: 'Successfully fetched data'
  }
})


app.use(router.routes())
app.use(router.allowedMethods())

console.log('Running on port: ', port)
await app.listen({ port })
