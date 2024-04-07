import { Application, Router } from "https://deno.land/x/oak/mod.ts"
import { neon } from 'npm:@neondatabase/serverless'
import { drizzle } from 'npm:drizzle-orm/neon-http'
import { env } from './constants.ts'
import * as schema from "./db/schema.ts"

const sql = neon(env.DB_CONNECTION_STRING!)
const db = drizzle(sql, { schema })

const port = 8000
const app = new Application()
const router = new Router()

router.get('/', async (ctx) => {
  ctx.response.body = 'deno-akira-db-api running... 🦕'
})

router.get('/strategies', async (ctx) => {
  const data = await db.query.strategies.findMany()

  ctx.response.body = {
    success: true,
    data: data,
    message: 'Successfully fetched data'
  }
})

router.get('/strategies/:name', async (ctx) => {
  const data = await db.query.strategies.findFirst({
    where: ((strat, { eq }) => eq(strat.name, ctx.params.name ?? 'null')),
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
