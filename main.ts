import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import { neon } from 'npm:@neondatabase/serverless'
import { drizzle } from 'npm:drizzle-orm/neon-http'
import { env } from './constants.ts'
import * as schema from "./db/schema.ts"
import { running } from './akira-art.ts'
import { isAuthorized, setHeaders } from "./helpers.ts"
import { strategies } from './db/schema.ts'
import { eq } from 'drizzle-orm'

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

  setHeaders(ctx)
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
